import React from 'react'

function Onboarding({ onStart }) {
  const steps = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="animate-float">
          <rect width="64" height="64" rx="16" fill="#3b82f6" opacity="0.1"/>
          <circle cx="32" cy="32" r="20" fill="none" stroke="#3b82f6" strokeWidth="3"/>
          <circle cx="32" cy="32" r="16" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6"/>
          <circle cx="32" cy="32" r="6" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
          <circle cx="32" cy="32" r="3" fill="#3b82f6"/>
        </svg>
      ),
      title: "Smart Price Estimator",
      description: "A built-in pricing engine that turns your car's details into a clear low, mid, and high range. You'll walk in knowing exactly what's fair before you even see the sticker.",
      color: "blue"
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="animate-float">
          <rect width="64" height="64" rx="16" fill="#10b981" opacity="0.1"/>
          <path d="M20 32h24M32 20v24" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="32" cy="32" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
        </svg>
      ),
      title: "Saved Deals & Notes Hub",
      description: "Keep all your potential deals, photos, and notes organized in one place. Track where you're at so you always stay in control.",
      color: "green"
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="animate-float">
          <rect width="64" height="64" rx="16" fill="#f59e0b" opacity="0.1"/>
          <path d="M20 32h8l4-8 8 16 4-8h8" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="24" cy="32" r="3" fill="#f59e0b"/>
          <circle cx="40" cy="32" r="3" fill="#f59e0b"/>
        </svg>
      ),
      title: "Step-by-Step Negotiation Checklist",
      description: "No more second-guessing. A guided checklist keeps you steady during the deal from setting your budget to reviewing contracts before you sign.",
      color: "orange"
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="animate-float">
          <rect width="64" height="64" rx="16" fill="#8b5cf6" opacity="0.1"/>
          <path d="M20 20h24v24H20z" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
          <path d="M28 28h8v8h-8z" fill="#8b5cf6" opacity="0.3"/>
          <circle cx="32" cy="32" r="2" fill="#8b5cf6"/>
          <path d="M24 24l16 16M40 24l-16 16" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "The Negotiator – Your Deal-Making Edge",
      description: "A smart coach that preps you for every step of the dealership game. Get negotiation scripts, red-flag alerts, and paperwork review checklists so you never miss hidden fees.",
      color: "purple"
    }
  ]

  return (
    <div className="onboarding">
      <div className="onboarding-header">
        <h1>The Car Deal Coach</h1>
        <p className="tagline">Because An Informed Purchase, Is a Smart Purchase!</p>
        <p>Four Core Benefits of The Car Deal Coach</p>
      </div>

      <div className="onboarding-steps">
        {steps.map((step, index) => {
          const getCardStyle = (color) => {
            const styles = {
              blue: {
                backgroundColor: '#1e3a8a',
                borderColor: '#3b82f6',
                buttonColor: '#3b82f6'
              },
              green: {
                backgroundColor: '#14532d',
                borderColor: '#10b981',
                buttonColor: '#10b981'
              },
              orange: {
                backgroundColor: '#9a3412',
                borderColor: '#f59e0b',
                buttonColor: '#f59e0b'
              },
              purple: {
                backgroundColor: '#581c87',
                borderColor: '#8b5cf6',
                buttonColor: '#8b5cf6'
              }
            }
            return styles[color] || styles.blue
          }

          const cardStyle = getCardStyle(step.color)

          return (
            <div 
              key={index} 
              className={`onboarding-step step-${index + 1}`}
              style={{
                backgroundColor: cardStyle.backgroundColor,
                borderColor: cardStyle.borderColor,
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            >
              <div className="step-icon">
                {step.icon}
              </div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              <button 
                className="btn btn-primary"
                style={{
                  backgroundColor: cardStyle.buttonColor,
                  borderColor: cardStyle.buttonColor,
                  color: 'white'
                }}
                onClick={() => {
                  alert(`Learn more about: ${step.title}`)
                }}
              >
                Learn More
              </button>
            </div>
          )
        })}
      </div>

      <div className="onboarding-actions">
        <button 
          className="btn btn-primary btn-large"
          onClick={onStart}
        >
          Start a Deal
        </button>
        <p className="onboarding-note">
          Ready to find your next car? Let's get started!
        </p>
      </div>
    </div>
  )
}

export default Onboarding