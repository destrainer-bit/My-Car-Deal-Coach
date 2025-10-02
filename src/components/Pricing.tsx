import React, { useEffect, useState } from 'react'
import '../components/pricing.css'
import { upgradePlans } from '../data/upgradePlans.js'

type CheckoutState = {
  loading: boolean
  error: string | null
}

const initialState: CheckoutState = { loading: false, error: null }

function Pricing() {
  const [state, setState] = useState<CheckoutState>(initialState)
  const [highlight, setHighlight] = useState<string | null>(null)

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
      setState({ loading: false, error: 'Checkout unavailable for this plan.' })
      return
    }

    setState({ loading: true, error: null })

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priceId: plan.priceId })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Unable to start checkout.')
      }

      const data = await response.json()

      if (data?.url) {
        window.location.href = data.url
        return
      }

      throw new Error('Checkout session did not return a URL.')
    } catch (error: any) {
      setState({ loading: false, error: error.message || 'Something went wrong.' })
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

              <button className="cta" onClick={() => handleSelect(plan.id)} disabled={state.loading || disabled}>
                {plan.cta || 'Purchase Now!'}
              </button>

              <p className="fineprint">
                Typical buyers overpay $1,500–$5,000 without guidance. Keep it in your pocket.
              </p>
            </article>
          )
        })}
      </div>

      {state.error && <p className="pricing-error">{state.error}</p>}
    </section>
  )
}

export default Pricing
