// Local agent implementation that works without Vercel API
import OpenAI from "openai";
import { z } from "zod";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'demo-key';
const client = apiKey && apiKey !== 'OPENAI_API_KEY' ? new OpenAI({ apiKey }) : null;

const StepSchema = z.object({
  plan: z.string(),
  action: z.string(),
  tool_call: z.object({
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

export async function runLocalAgentStep(goal, history = []) {
  try {
    if (!client) {
      return {
        plan: "API key not configured",
        action: "Please set up your OpenAI API key in the .env file",
        result: null,
        result_summary: "To use the AI agent, you need to set VITE_OPENAI_API_KEY in your .env file",
        done: false,
        next_hint: "Get an API key from https://platform.openai.com and add it to your .env file"
      };
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: `Goal: ${goal}` }
    ];

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages
    });

    const raw = resp.choices[0]?.message?.content || "{}";
    let step;
    
    try {
      step = StepSchema.parse(JSON.parse(raw));
    } catch (e) {
      // Fallback if model strays
      step = {
        plan: "Reformatting output to valid JSON.",
        action: "Self-correct to schema then proceed.",
        tool_call: null,
        result_summary: "Output did not match schema; will correct next step.",
        done: false,
        next_hint: "Return JSON strictly matching schema keys and types."
      };
    }

    // Simple tool execution (no external APIs for now)
    let toolResult = null;
    if (step.tool_call) {
      const { name, args } = step.tool_call;
      
      if (name === "math") {
        try {
          if (!/^[\d\.\+\-\*\/\(\) ]+$/.test(args.expression)) {
            throw new Error("Unsafe math input");
          }
          toolResult = { value: eval(args.expression) };
        } catch (e) {
          toolResult = { error: "Invalid math expression" };
        }
      } else if (name === "web_search") {
        toolResult = [{ 
          title: "Market Research", 
          url: "https://example.com", 
          snippet: `Research results for: ${args.query}` 
        }];
      } else {
        toolResult = { message: `Tool ${name} executed with args: ${JSON.stringify(args)}` };
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
  } catch (error) {
    console.error('Agent error:', error);
    return {
      plan: "Error occurred",
      action: "Failed to execute step",
      result: null,
      result_summary: error.message,
      done: false,
      next_hint: "Check API key and try again"
    };
  }
}
