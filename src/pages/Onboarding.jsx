import React from 'react'

function Onboarding({ onStart }) {
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
          <span className="onboarding-eyebrow">Car buying without the games</span>
          <h1>Imagine a world where car buying no longer feels like a battle against pressure, persuasion, or dishonest sales tactics. Instead, it's smooth, honest, and genuinely enjoyable. Welcome to a new way of car shopping, the way it should be.</h1>
          <p>
            Your AI-powered car buying coach gives you scripts, calculators, and negotiation tactics so you can push back on pressure, spot hidden fees, and walk away with the deal you want.
          </p>
          <div className="onboarding-hero-actions">
            <button className="btn btn-primary btn-large" onClick={onStart}>
              Start a Deal
            </button>
            <button className="btn btn-secondary btn-outline" onClick={onStart}>
              Explore the Coach
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
        <p>
          Hidden fees, finance tricks, pressure tactics—buyers lose thousands every day. Car Deal Coach flips the script so you stay in control.
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
              <p>{feature.description}</p>
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
          <span className="onboarding-eyebrow">Founder’s Note</span>
          <h3>Built by dealership insiders</h3>
          <p>
            I built Car Deal Coach after watching friends get steamrolled in finance offices. This is the defense playbook I wish every buyer had—real scripts, calculators, and backup when the dealer starts playing games.
          </p>
        </div>
      </section>

      <section className="onboarding-cta" id="cta">
        <h2>Ready to buy smarter?</h2>
        <p>Cancel anytime. No hidden fees. Built for buyers—not dealers.</p>
        <button className="btn btn-primary btn-large" onClick={onStart}>
          Get Your Car Coach Today
        </button>
      </section>
    </div>
  )
}

export default Onboarding