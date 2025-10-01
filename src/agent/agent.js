import OpenAI from "openai";
import { z } from "zod";
import { tools, toolNames } from "./tools.js";

const client = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

const StepSchema = z.object({
  plan: z.string(),
  action: z.string(),                        // human-readable "what I'll do now"
  tool_call: z.object({                      // optional tool to execute
    name: z.string(),
    args: z.any()
  }).nullable(),
  result_summary: z.string().nullable(),
  done: z.boolean(),
  next_hint: z.string().nullable()
});

const SYSTEM_PROMPT = `
You are "The Negotiator"—a concise, truthful, tactically calm car-deal agent.
Goals:
- Achieve buyer target (OTD if specified) or conclude it's not feasible.
- Surface ALL fees/add-ons; flag junk fees (etching, nitrogen, paint, VIN add-ons).
- Produce short outreach/counter scripts.
Stop when:
- Target met OR two counters fail OR math is contradictory.
Rules:
- No fabrications; prefer written quotes and itemized numbers.
- Work stepwise. Each step: return STRICT JSON matching schema.
Schema:
{plan, action, tool_call?, result_summary, done, next_hint}
`;

export async function runAgentStep({
  goal,
  history,
  runId
}) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: `Goal: ${goal}` }
  ];

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini", // upgrade to latest available when you can
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages
  });

  const raw = resp.choices[0]?.message?.content || "{}";
  let step;
  try {
    step = StepSchema.parse(JSON.parse(raw));
  } catch (e) {
    // Fallback if model strays: mark as not-done with parser hint
    step = {
      plan: "Reformatting output to valid JSON.",
      action: "Self-correct to schema then proceed.",
      tool_call: null,
      result_summary: "Output did not match schema; will correct next step.",
      done: false,
      next_hint: "Return JSON strictly matching schema keys and types."
    };
  }

  // Execute tool if requested
  let toolResult = null;
  if (step.tool_call) {
    const name = step.tool_call.name;
    const fn = tools[name];
    if (!fn) throw new Error(`Unknown tool: ${name}`);
    const args = step.tool_call.args;
    // Tools that need runId appended receive it as last param
    if (name === "memory_upsert" || name === "memory_get") {
      toolResult = await fn(...(Array.isArray(args) ? args : [args]), runId);
    } else {
      toolResult = await fn(...(Array.isArray(args) ? args : [args]));
    }
  }

  return {
    plan: step.plan,
    action: step.action,
    result: toolResult,
    result_summary: step.result_summary,
    done: step.done,
    next_hint: step.next_hint
  };
}


