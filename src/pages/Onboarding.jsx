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

      <section className="onboarding-hero mobile-first-hero" id="hero">
        <div className="onboarding-hero-content">
          <span className="onboarding-eyebrow orange-text">Car buying without the games</span>
          <h1>
            Imagine a world where car buying no longer feels like a battle against pressure, persuasion, or dishonest sales tactics.
          </h1>
          <h1>
            Instead, it's smooth, honest, and genuinely enjoyable. Welcome to a new way of car shopping, the way it should be.
          </h1>
          <p className="orange-text">
            Your AI-powered car buying coach gives you scripts, calculators, and negotiation tactics so you can push back on pressure, spot hidden fees, and walk away with the deal you want.
          </p>
          <div className="onboarding-hero-actions">
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


          <section className="onboarding-features mobile-first-features" id="features">
            <div className="mobile-first-features-grid">
        {featureBlocks.map((feature) => (
            <div key={feature.title} className="mobile-first-feature-card">
              <h3>
                {feature.title}
              </h3>
              <p style={{ 
                color: feature.title === 'Payment Calculator & Rate Decoder' ? '#10b981' : '#ffffff'
              }}>
                {feature.description}
              </p>
              <div className="mobile-first-feature-points">
                {feature.points.map((point, index) => {
                  // Use colored borders instead of backgrounds
                  let borderColor = '#3b82f6'; // Default blue
                  
                  if (feature.title === 'Scripts & Red Flags') {
                    borderColor = '#f59e0b'; // Orange
                  } else if (feature.title === 'Payment Calculator & Rate Decoder') {
                    borderColor = '#3b82f6'; // Blue
                  } else if (feature.title === 'Dealership Psychology Training') {
                    borderColor = '#10b981'; // Emerald Green
                  }
                  
                  return (
                    <div 
                      key={`${feature.title}-${index}`} 
                      className="mobile-first-feature-point"
                      style={{
                        border: `2px solid ${borderColor}`,
                        boxShadow: `0 0 8px ${borderColor}40`
                      }}
                    >
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
        <p className="orange-text">One-time payment. No hidden fees. Built for buyers, not dealers.</p>
        <button className="btn btn-primary btn-large" onClick={onStart}>
          Get Your Car Coach Today
        </button>
      </section>
    </div>
  )
}

export default Onboarding