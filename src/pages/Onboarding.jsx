import React from 'react'
import { useNavigate } from 'react-router-dom'
import SavingsCalculator from '../components/SavingsCalculator'

function Onboarding({ onStart }) {
  const navigate = useNavigate()
  const problemItems = [
    '“Why is my payment higher than we agreed?”',
    'Surprise warranties, paint protection, and GAP bundles you never asked for',
    'Finance office rate bumps and “sign now or lose the deal” pressure'
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
      description: 'Role-play pressure scenarios with the Personal Negotiator Agent so “sign now or lose the car” never rattles you again.',
      points: [
        'Simulated high-pressure finance conversations',
        'Behavioral tactics to stay calm and in control',
        'Paperwork review checklists before you sign'
      ],
      callout: {
        label: 'Stay ready',
        body: '“I’m ready to buy when the numbers match what we agreed.” Scarcity pressure handled—on your terms.'
      }
    }
  ]

  const testimonials = [
    {
      quote: '“I walked in with scripts on my phone. Finance tried to add a warranty—Car Deal Coach told me exactly what to say. Saved $3,900.”',
      author: 'Sarah M., first-time buyer'
    },
    {
      quote: '“The dealer flipped the rate in the back office. The calculator exposed it and I renegotiated on the spot.”',
      author: 'Mike R., repeat buyer'
    }
  ]

  return (
    <div className="onboarding">
    <section className="onboarding-hero" id="hero">
        <div className="onboarding-hero-content">
          <span className="onboarding-eyebrow orange-text">Car buying without the games</span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.4', marginBottom: '1.5rem', letterSpacing: '0.02em' }}>
            Imagine a world where car buying no longer feels like a battle against pressure, persuasion, or dishonest sales tactics.
          </h1>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.4', marginBottom: '1.5rem', letterSpacing: '0.02em' }}>
            Instead, it's smooth, honest, and genuinely enjoyable. Welcome to a new way of car shopping, the way it should be.
          </h1>
          <p className="orange-text" style={{ marginBottom: '2rem', fontSize: '1.05rem', maxWidth: '100%', lineHeight: '1.2' }}>
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
        <div className="onboarding-hero-visual">
          <div className="onboarding-screen">
            <h3>Personal Negotiator Agent</h3>
            <div className="onboarding-screen-card">
              <strong>Goal:</strong>
              OTD under $25,000 for 2020 Civic EX
            </div>
            <div className="onboarding-screen-card">
              <strong>Red Flag:</strong>
              Dealer added $1,200 “doc fee”. Standard is $300—ask for itemized breakdown.
            </div>
            <div className="onboarding-screen-card">
              <strong>Say This:</strong>
              “I’ve researched and seen comparable cars at $23,500 OTD. Can you match that?”
            </div>
            <div className="onboarding-screen-card">
              <strong>Next Move:</strong>
              If they won’t drop the add-ons, walk away. They’ll call back.
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
            <p>Of drivers sign finance paperwork they don’t fully understand.</p>
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

      <section className="onboarding-features" id="features">
        {featureBlocks.map((feature) => (
          <article className="onboarding-feature" key={feature.title}>
            <div className="onboarding-feature-copy">
              <h3>{feature.title}</h3>
              <p className={feature.title === 'Payment Calculator & Rate Decoder' ? 'green-text' : ''}>{feature.description}</p>
              <ul className="feature-points">
                {feature.points.map(point => (
                  <li key={point}>
                    <span className="feature-pill">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="onboarding-feature-visual">
              <div className="onboarding-callout">
                <span className="callout-label">{feature.callout.label}</span>
                <p>{feature.callout.body}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Savings Calculator Section */}
      <section className="onboarding-calculator" style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: '800', marginBottom: 'var(--space-md)' }}>
            Estimate your savings
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: '0.9', maxWidth: '640px', margin: '0 auto' }}>
            Adjust the numbers and watch the story lose its grip. Full line-by-line breakdown unlocks with your plan.
          </p>
        </div>
        <SavingsCalculator isPaid={false} />
      </section>

      <section className="onboarding-social">
        <div className="onboarding-testimonials">
          {testimonials.map(testimonial => (
            <div className="onboarding-testimonial" key={testimonial.author}>
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