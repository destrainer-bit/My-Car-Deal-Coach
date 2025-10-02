import React, { useEffect, useState } from 'react'
import '../components/pricing.css'
import { upgradePlans } from '../data/upgradePlans.js'
import { useSubscription } from '../hooks/useSubscription'

function Pricing() {
  const [highlight, setHighlight] = useState<string | null>(null)
  const { startCheckout, loading: subscriptionLoading, subscription } = useSubscription()

  useEffect(() => {
    const stored = localStorage.getItem('highlightTier')
    if (stored) {
      setHighlight(stored)
      localStorage.removeItem('highlightTier')
    }

    const params = new URLSearchParams(window.location.search)
    const queryHighlight = params.get('highlight')
    if (queryHighlight) {
      setHighlight(queryHighlight)
    }
  }, [])

  const handleSelect = async (planId: string) => {
    const plan = upgradePlans.find((p) => p.id === planId)

    if (!plan || !plan.priceId) {
      alert('This plan is not available. Please contact support.')
      return
    }

    try {
      await startCheckout(plan.priceId, {
        successUrl: `${window.location.origin}/app?upgrade=success`,
        cancelUrl: `${window.location.origin}/pricing`,
        mode: plan.mode || 'payment'
      })
    } catch (error: any) {
      console.error('Checkout failed:', error)
      alert('Failed to start checkout. Please try again.')
    }
  }

  return (
    <section id="pricing" className="pricing-wrap">
      <header className="pricing-header">
        <h2>Choose Your Protection</h2>
        <p className="sub">Save thousands in markups, add-ons, and finance games for less than a soda a day.</p>
      </header>

      <div className="pricing-grid">
        {upgradePlans.map((plan) => {
          const disabled = !plan.priceId
          const dynamicAccent =
            plan.featured || plan.label.toLowerCase() === (highlight || '').toLowerCase()

          return (
            <article key={plan.id} className={`card ${dynamicAccent ? 'accent pulse' : ''}`}>
              {plan.badge && <span className="ribbon">{plan.badge}</span>}

              <div className="price-row">
                <span className="price">{plan.price}</span>
                <span className="per">{plan.perDay}</span>
              </div>
              <div className="label">{plan.label}</div>

              <h3 className="headline">{plan.title}</h3>
              {plan.blurb && <p className="blurb">{plan.blurb}</p>}

              <ul className="bullets">
                {plan.highlights.map((item) => (
                  <li key={item}>✅ {item}</li>
                ))}
              </ul>

              <button 
                className="cta" 
                onClick={() => handleSelect(plan.id)} 
                disabled={subscriptionLoading || disabled}
              >
                {subscriptionLoading ? 'Processing...' : (plan.cta || 'Purchase Now!')}
              </button>

              <p className="fineprint">
                Typical buyers overpay $1,500–$5,000 without guidance. Keep it in your pocket.
              </p>
            </article>
          )
        })}
      </div>

      {/* Subscription status indicator */}
      {subscription.isActive && (
        <div className="subscription-status">
          <p>✅ You have an active {subscription.tier} subscription</p>
        </div>
      )}
    </section>
  )
}

export default Pricing
