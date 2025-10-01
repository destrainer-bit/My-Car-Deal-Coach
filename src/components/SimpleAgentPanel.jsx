import { useState } from 'react';

export default function SimpleAgentPanel(){
  const [goal, setGoal] = useState("Get OTD for Lexus RX ≤ $39,500 and itemize fees.");
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);

  async function step(){
    setBusy(true);
    
    // Simulate AI working
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSteps = [
      {
        plan: "Analyze the goal and break down the negotiation strategy",
        action: "Research market prices for Lexus RX and identify negotiation points",
        result: { marketPrice: 42000, targetPrice: 39500, difference: 2500 },
        result_summary: "Found that target price is $2,500 below market average. Need to negotiate dealer fees and add-ons.",
        done: false,
        next_hint: "Focus on eliminating dealer fees and negotiating the base price"
      },
      {
        plan: "Calculate all fees and taxes to determine true OTD cost",
        action: "Break down dealer fees, taxes, and add-ons",
        result: { 
          basePrice: 42000, 
          dealerFees: 2500, 
          taxes: 3360, 
          totalOTD: 47860,
          targetOTD: 39500,
          savingsNeeded: 8360
        },
        result_summary: "Current OTD is $47,860. Need to reduce by $8,360 to meet target of $39,500.",
        done: false,
        next_hint: "Negotiate dealer fees down and eliminate unnecessary add-ons"
      },
      {
        plan: "Generate negotiation script and counter-offer strategy",
        action: "Create specific talking points and counter-offers",
        result: {
          script: "I've done my research and found similar vehicles for $39,500 OTD. I can offer $38,000 plus tax and title only.",
          counterOffers: ["Remove $2,500 dealer fee", "Eliminate $800 paint protection", "Remove $400 VIN etching"]
        },
        result_summary: "Prepared negotiation script focusing on eliminating dealer fees and add-ons.",
        done: true,
        next_hint: "Present the counter-offer and be prepared to walk away if they don't meet your target"
      }
    ];
    
    const stepIndex = log.length;
    if (stepIndex < mockSteps.length) {
      setLog(l => [...l, mockSteps[stepIndex]]);
    } else {
      setLog(l => [...l, {
        plan: "Negotiation complete",
        action: "All steps completed",
        result: null,
        result_summary: "Mock negotiation completed. Set up OpenAI API key for real AI assistance.",
        done: true,
        next_hint: "Get an API key from https://platform.openai.com to enable real AI negotiation"
      }]);
    }
    
    setBusy(false);
  }

  function reset(){
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
      <div style={{ 
        padding: '0.5rem', 
        backgroundColor: 'var(--color-warning)', 
        color: 'white', 
        borderRadius: '4px', 
        marginBottom: '1rem',
        fontSize: '0.875rem'
      }}>
        <strong>Demo Mode:</strong> This shows how the AI agent would work. To get real AI assistance, you need to add your OpenAI API key to the .env file.
      </div>
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
RESULT: ${JSON.stringify(s.result, null, 2)}
SUMMARY: ${s.result_summary}
DONE: ${s.done}

`).join('')}
      </pre>
    </div>
  );
}
