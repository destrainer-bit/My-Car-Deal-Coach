import React, { useEffect, useState } from 'react'
import '../components/pricing.css'
import { upgradePlans } from '../data/upgradePlans.js'
import { useSubscription } from '../hooks/useSubscription'
import { supabase } from '../lib/supabaseClient'

function Pricing() {
  const [highlight, setHighlight] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { startCheckout, loading: subscriptionLoading, subscription } = useSubscription()

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    // Listen for auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => authSub.unsubscribe()
  }, [])

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
    // Check if user is authenticated first
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    const plan = upgradePlans.find((p) => p.id === planId)

    if (!plan || !plan.priceId) {
      alert('This plan is not available. Please contact support.')
      return
    }

    try {
      // Start the checkout (it will create Stripe customer automatically if needed)
      await startCheckout(plan.priceId, {
        successUrl: `${window.location.origin}/app?upgrade=success`,
        cancelUrl: `${window.location.origin}/pricing`,
        mode: plan.mode || 'payment'
      })
    } catch (error: any) {
      console.error('Checkout failed:', error)
      alert(`Failed to start checkout: ${error.message || 'Please try again.'}`)
    }
  }

  const handleAuth = async (email: string, password: string, isSignUp: boolean) => {
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      setShowAuthModal(false)
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <section id="pricing" className="mobile-first-pricing">
      <header className="mobile-first-pricing-header">
        <h2>Choose Your Protection</h2>
        <p className="mobile-first-pricing-sub">Save thousands in markups, add-ons, and finance games for less than a soda a day.</p>
      </header>

      <div className="mobile-first-pricing-grid">
        {upgradePlans.map((plan) => {
          const disabled = !plan.priceId
          const dynamicAccent =
            plan.featured || plan.label.toLowerCase() === (highlight || '').toLowerCase()

          return (
            <article key={plan.id} className={`mobile-first-pricing-card ${dynamicAccent ? 'accent pulse' : ''}`}>
              {plan.badge && <span className="mobile-first-ribbon">{plan.badge}</span>}

              <div className="mobile-first-price-row">
                <span className="mobile-first-price">{plan.price}</span>
                <span className="mobile-first-per">{plan.perDay}</span>
              </div>
              <div className="mobile-first-label">{plan.label}</div>

              <h3 className="mobile-first-headline">{plan.title}</h3>
              {plan.blurb && <p className="mobile-first-blurb">{plan.blurb}</p>}

              <ul className="mobile-first-bullets">
                {plan.highlights.map((item) => (
                  <li key={item}>✅ {item}</li>
                ))}
              </ul>

              <button 
                className="mobile-first-cta" 
                onClick={() => handleSelect(plan.id)} 
                disabled={subscriptionLoading || disabled}
              >
                {subscriptionLoading ? 'Processing...' : (plan.cta || 'Purchase Now!')}
              </button>

              <p className="mobile-first-fineprint">
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

      {/* Simple Auth Modal */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-panel)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Sign in to continue</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const email = formData.get('email') as string
              const password = formData.get('password') as string
              const isSignUp = formData.get('signup') === 'true'
              handleAuth(email, password, isSignUp)
            }}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-soft)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-soft)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              />
              <div className="mobile-first-button-group">
                <button
                  type="submit"
                  name="signup"
                  value="false"
                  className="mobile-first-cta"
                >
                  Sign In
                </button>
                <button
                  type="submit"
                  name="signup"
                  value="true"
                  className="mobile-first-cta mobile-first-cta-accent"
                >
                  Sign Up
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Pricing



