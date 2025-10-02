import { supabaseServer } from '../src/lib/supabaseServer.js';
import { runAgentStep } from '../src/agent/agent.js';

export default async function handler(req, res) {
  try {
    const { goal, runId } = req.method === 'POST' ? req.body : req.query;
    if (!goal && !runId) return res.status(400).json({ error: "Provide goal or runId" });

    // create run if needed
    let id = (runId);
    if (!id) {
      const { data, error } = await supabaseServer.from('agent_runs').insert({ goal }).select().single();
      if (error) throw error;
      id = data.id;
    }

    // load history
    const { data: msgs } = await supabaseServer
      .from('agent_messages')
      .select('*')
      .eq('run_id', id)
      .order('created_at', { ascending: true });

    const history = (msgs || []).map(m => ({ role: m.role, content: m.content }));

    // run one step
    const step = await runAgentStep({ goal: String(goal ?? ''), history, runId: id });

    // log assistant step
    await supabaseServer.from('agent_messages').insert({
      run_id: id,
      role: 'assistant',
      content: step
    });

    // mark done
    if (step.done) {
      await supabaseServer.from('agent_runs').update({ status: 'done', updated_at: new Date().toISOString() }).eq('id', id);
    }

    res.status(200).json({ runId: id, step });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}




