import { useState } from 'react';
import { runLocalAgentStep } from '../lib/localAgent.js';

export default function NegotiatorAgentPanel(){
  const [goal, setGoal] = useState("Get OTD for Lexus RX ≤ $39,500 and itemize fees.");
  const [runId, setRunId] = useState();
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);

  async function step(){
    setBusy(true);
    try {
      // Use local agent instead of API call
      const step = await runLocalAgentStep(goal, log.map(l => ({ role: 'assistant', content: l })));
      setLog(l => [...l, step]);
    } catch (error) {
      console.error('Agent step failed:', error);
      setLog(l => [...l, { 
        plan: "Error occurred", 
        action: "Failed to execute step", 
        result: null, 
        result_summary: error.message, 
        done: false, 
      }]);
    }
    setBusy(false);
  }

  function reset(){
    setRunId(undefined);
    setLog([]);
  }

  return (
    <div style={{
      maxWidth: 720, 
      margin: '1rem auto', 
      padding: '1rem', 
      border: '1px solid #eee', 
      borderRadius: 12,
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-primary)' }}>The Negotiator Agent</h3>
      <textarea 
        value={goal} 
        onChange={e=>setGoal(e.target.value)} 
        rows={3} 
        style={{
          width:'100%',
          padding: '0.5rem',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          resize: 'vertical'
        }}
        placeholder="Enter your negotiation goal..."
      />
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button 
          onClick={step} 
          disabled={busy}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: busy ? 'var(--text-secondary)' : 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: busy ? 'not-allowed' : 'pointer'
          }}
        >
          {busy ? 'Working…' : 'Run Step'}
        </button>
        <button 
          onClick={reset} 
          disabled={busy}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: busy ? 'not-allowed' : 'pointer'
          }}
        >
          Reset
        </button>
      </div>
      <pre style={{
        background:'#0b0b0b', 
        color:'#b6ffb6', 
        padding:12, 
        marginTop:12, 
        whiteSpace:'pre-wrap',
        borderRadius: '4px',
        fontSize: '0.875rem',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
{log.map((s,i)=>`#${i+1}
PLAN: ${s.plan}
ACTION: ${s.action}
RESULT: ${JSON.stringify(s.result)}
SUMMARY: ${s.result_summary}
DONE: ${s.done}

`).join('')}
      </pre>
    </div>
  );
}
