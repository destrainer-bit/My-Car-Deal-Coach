import { supabaseServer } from "../lib/supabaseServer.js";

export const tools = {
  async math(expression) {
    if (!/^[\d\.\+\-\*\/\(\) ]+$/.test(expression)) throw new Error("Unsafe math input");
    // eslint-disable-next-line no-eval
    const value = eval(expression);
    return { value };
  },

  async memory_upsert(key, value, runId) {
    await supabaseServer.from('agent_messages').insert({
      run_id: runId,
      role: 'tool',
      content: { type: 'memory_upsert', key, value }
    });
    return { ok: true };
  },

  async memory_get(key, runId) {
    const { data } = await supabaseServer
      .from('agent_messages')
      .select('*')
      .eq('run_id', runId)
      .contains('content', { type: 'memory_upsert', key })
      .order('created_at', { ascending: true });
    const last = data?.at(-1);
    return last?.content?.value ?? null;
  },

  // Stub you can later wire to a search API (Tavily/Bing/etc.)
  async web_search(query) {
    return [{ title: "Stub result", url: "https://example.com", snippet: `You searched: ${query}` }];
  },

  // Stub for email; swap to Resend/SendGrid later
  async email_send(to, subject, body) {
    return { queued: true, to, subject };
  }
};

export const toolNames = Object.keys(tools);




