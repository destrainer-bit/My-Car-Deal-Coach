import React from 'react'
import { useNavigate } from 'react-router-dom'
import SavingsCalculator from '../components/SavingsCalculator'

function Onboarding({ onStart }) {
  const navigate = useNavigate()
  const problemItems = [
    '"Why is my payment higher than we agreed?"',
    'Surprise warranties, paint protection, and GAP bundles you never asked for',
    'Finance office rate bumps and "sign now or lose the deal" pressure'
  ]

  const featureBlocks = [
    {
      title: 'Scripts & Red Flags',
      description: 'Hit the dealership with responses written by insiders. When the sales manager pulls a tactic, you already know the counter move.',
      points: [
        'Instant scripts for every objection',
        'Red-flag alerts when fees spike',
        'Walk-away triggers to keep leverage'
      ],
      callout: {
        label: 'Coach insight',
        body: 'Doc fee is padded by $900. Counter with $300 max or ask for it waived.'
      }
    },
    {
      title: 'Payment Calculator & Rate Decoder',
      description: 'Plug in any dealer worksheet and expose the true APR, payment, and where the numbers are padded.',
      points: [
        'Flexible loan terms (60, 72, 84+ months)',
        'Breakdown of principal vs. interest',
        'Side-by-side monthly payment comparisons'
      ],
      callout: {
        label: 'After analysis',
        body: 'Dealer APR is 8.4%. Real rate should be 6.1%. Monthly drops from $512 to $456 when you push back.'
      }
    },
    {
      title: 'Dealership Psychology Training',
      description: 'Role-play pressure scenarios with the Personal Negotiator Agent so "sign now or lose the car" never rattles you again.',
      points: [
        'Simulated high-pressure finance conversations',
        'Behavioral tactics to stay calm and in control',
        'Paperwork review checklists before you sign'
      ],
      callout: {
        label: 'Stay ready',
        body: '"I\'m ready to buy when the numbers match what we agreed." Scarcity pressure handled—on your terms.'
      }
    }
  ]

  const testimonials = [
    {
      quote: '"The dealer flipped the rate in the back office. The calculator exposed it and I renegotiated on the spot."',
      author: 'Mike R., repeat buyer'
    }
  ]

  return (
    <div className="onboarding">
      {/* Top Navigation Bar with Sign In */}
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: '1000',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>
          Car Deal Coach
        </div>
        <button 
          onClick={() => navigate('/signin')}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#2563eb'}
          onMouseOut={(e) => e.target.style.background = '#3b82f6'}
        >
          Sign In
        </button>
      </div>

      <section className="onboarding-hero" id="hero" style={{ 
        paddingTop: '80px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        maxWidth: 'min(90%, 900px)',
        margin: '0 auto',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div className="onboarding-hero-content" style={{ textAlign: 'center', width: '100%', padding: '0 2rem' }}>
          <span className="onboarding-eyebrow orange-text" style={{ display: 'block', marginBottom: '1rem', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Car buying without the games</span>
          <h1 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', lineHeight: '1.3', marginBottom: '1rem', letterSpacing: '0.01em', textAlign: 'center' }}>
            Imagine a world where car buying no longer feels like a battle against pressure, persuasion, or dishonest sales tactics.
          </h1>
          <h1 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', lineHeight: '1.3', marginBottom: '1rem', letterSpacing: '0.01em', textAlign: 'center' }}>
            Instead, it's smooth, honest, and genuinely enjoyable. Welcome to a new way of car shopping, the way it should be.
          </h1>
          <p className="orange-text" style={{ marginBottom: '2rem', fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)', maxWidth: '100%', lineHeight: '1.2', textAlign: 'center' }}>
            Your AI-powered car buying coach gives you scripts, calculators, and negotiation tactics so you can push back on pressure, spot hidden fees, and walk away with the deal you want.
          </p>
          <div className="onboarding-hero-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/pricing')}>
              Start a Deal
            </button>
            <button className="btn btn-secondary btn-outline" onClick={() => navigate('/app/how-to-use')}>
              Take the tour
            </button>
          </div>
        </div>
      </section>

      {/* Personal Negotiator Agent - Moved underneath */}
      <section style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="onboarding-screen" style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px', 
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: '1.5rem', 
              fontSize: '1.25rem',
              color: '#ffffff'
            }}>
              Personal Negotiator Agent
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1rem' 
            }}>
              <div className="onboarding-screen-card" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.9rem'
              }}>
                <strong style={{ color: '#3b82f6' }}>Goal:</strong>
                <br />
                OTD under $25,000 for 2020 Civic EX
              </div>
              <div className="onboarding-screen-card" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.9rem'
              }}>
                <strong style={{ color: '#ef4444' }}>Red Flag:</strong>
                <br />
                Dealer added $1,200 "doc fee". Standard is $300—ask for itemized breakdown.
              </div>
              <div className="onboarding-screen-card" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '1rem'
              }}>
                <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>Say This:</strong>
                <br />
                "I've researched and seen comparable cars at $23,500 OTD. Can you match that?"
              </div>
              <div className="onboarding-screen-card" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.9rem'
              }}>
                <strong style={{ color: '#f59e0b' }}>Next Move:</strong>
                <br />
                If they won't drop the add-ons, walk away. They'll call back.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="onboarding-problem">
        <h2>Car dealerships are trained to play games.</h2>
        <p className="orange-text">
          Hidden fees, finance tricks, and high-pressure tactics cost buyers thousands every day. Car Deal Coach flips the script and puts you back in control.
        </p>
        <div className="onboarding-problem-grid">
          <div className="onboarding-problem-card">
            <h3>$2,137</h3>
            <p>Average buyer overpays when they walk in without a plan.</p>
          </div>
          <div className="onboarding-problem-card">
            <h3>73%</h3>
            <p>Of drivers sign finance paperwork they don't fully understand.</p>
          </div>
          <div className="onboarding-problem-card checklist">
            <h4>Have you experienced this?</h4>
            <ul>
              {problemItems.map(item => (
              <li key={item}><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="onboarding-features" id="features" style={{ 
        padding: '4rem 2rem', 
        background: 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem', 
          maxWidth: '1200px',
          width: '100%'
        }}>
          {featureBlocks.map((feature) => (
            <div key={feature.title} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#ffffff', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                color: feature.title === 'Payment Calculator & Rate Decoder' ? '#10b981' : '#ffffff',
                marginBottom: '1.5rem',
                fontSize: '1rem',
                lineHeight: '1.4',
                textAlign: 'center'
              }}>
                {feature.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {feature.points.map((point, index) => {
                  // Simple color assignment based on feature title
                  let pillStyle = {};
                  
                  if (feature.title === 'Scripts & Red Flags') {
                    pillStyle = {
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    };
                  } else if (feature.title === 'Payment Calculator & Rate Decoder') {
                    pillStyle = {
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    };
                  } else if (feature.title === 'Dealership Psychology Training') {
                    pillStyle = {
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    };
                  }
                  
                  return (
                    <div key={`${feature.title}-${index}`} style={pillStyle}>
                      {point}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section className="onboarding-calculator" style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: '800', marginBottom: 'var(--space-md)' }}>
            See Your Potential Savings
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Try our calculator to estimate how much you could save with expert guidance
          </p>
        </div>
        <SavingsCalculator isPaid={false} />
      </section>

      {/* Social Proof */}
      <section className="onboarding-testimonials">
        <div className="onboarding-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="onboarding-testimonial">
              <p>{testimonial.quote}</p>
              <span>{testimonial.author}</span>
            </div>
          ))}
        </div>
        <div className="onboarding-founder">
          <span className="onboarding-eyebrow">Founder's Note</span>
          <h3>Built by dealership insiders</h3>
          <p>
            I built Car Deal Coach after watching buyer after buyer get steamrolled in finance offices. This is the defense playbook I wish every customer had, real scripts, calculators, and backup when the dealer starts playing games.
          </p>
        </div>
      </section>

      <section className="onboarding-cta" id="cta">
        <h2>Ready to buy smarter?</h2>
        <p className="orange-text">Cancel anytime. No hidden fees. Built for buyers, not dealers.</p>
        <button className="btn btn-primary btn-large" onClick={onStart}>
          Get Your Car Coach Today
        </button>
      </section>
    </div>
  )
}

export default Onboarding