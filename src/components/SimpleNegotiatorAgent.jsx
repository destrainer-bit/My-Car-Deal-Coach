import { useState } from 'react';

export default function SimpleNegotiatorAgent() {
  const [goal, setGoal] = useState("Get OTD for Lexus RX ≤ $39,500 and itemize fees.");
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);

  const mockAgentSteps = [
    {
      plan: "Research the target vehicle's market value and identify negotiation leverage points",
      action: "Analyze current market data for Lexus RX in your area",
      result_summary: "Found 3 similar vehicles: $38,500, $39,200, $40,100. Target of $39,500 is achievable.",
      done: false,
      next_hint: "Focus on dealer fees and add-ons - they often add $2,000-3,000"
    },
    {
      plan: "Prepare initial negotiation strategy and talking points",
      action: "Create opening script and identify key negotiation points",
      result_summary: "Ready with market data. Key points: competitive pricing, dealer fees transparency, financing options.",
      done: false,
      next_hint: "Start with 'I've done my research and found similar vehicles at...'"
    },
    {
      plan: "Execute negotiation with dealer",
      action: "Present research and negotiate price and fees",
      result_summary: "Dealer countered at $40,200. Need to negotiate dealer fees and add-ons.",
      done: false,
      next_hint: "Ask for itemized breakdown of all fees - challenge any unnecessary add-ons"
    },
    {
      plan: "Finalize deal terms",
      action: "Review final numbers and ensure target is met",
      result_summary: "Successfully negotiated to $39,450 OTD. All fees itemized and justified.",
      done: true,
      next_hint: "Deal complete! Review all paperwork before signing."
    }
  ];

  async function step() {
    setBusy(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentStep = mockAgentSteps[log.length];
    if (currentStep) {
      setLog(prev => [...prev, currentStep]);
    }
    
    setBusy(false);
  }

  function reset() {
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
        onChange={e => setGoal(e.target.value)} 
        rows={3} 
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          resize: 'vertical'
        }}
        placeholder="Enter your negotiation goal..."
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
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
      
      {log.length > 0 && (
        <div style={{
          background: '#0b0b0b', 
          color: '#b6ffb6', 
          padding: 12, 
          marginTop: 12, 
          borderRadius: '4px',
          fontSize: '0.875rem',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <h4 style={{ color: '#4ade80', margin: '0 0 8px 0' }}>Negotiation Progress:</h4>
          {log.map((step, index) => (
            <div key={index} style={{ marginBottom: '12px', padding: '8px', border: '1px solid #333', borderRadius: '4px' }}>
              <div style={{ fontWeight: 'bold', color: '#60a5fa' }}>Step {index + 1}:</div>
              <div style={{ margin: '4px 0' }}><strong>Plan:</strong> {step.plan}</div>
              <div style={{ margin: '4px 0' }}><strong>Action:</strong> {step.action}</div>
              <div style={{ margin: '4px 0' }}><strong>Result:</strong> {step.result_summary}</div>
              {step.next_hint && (
                <div style={{ margin: '4px 0', color: '#fbbf24' }}><strong>Next:</strong> {step.next_hint}</div>
              )}
              {step.done && (
                <div style={{ margin: '4px 0', color: '#10b981', fontWeight: 'bold' }}>✅ DEAL COMPLETE!</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

