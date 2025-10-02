import { useState } from 'react'
import PaymentModal from '../components/PaymentModal.jsx'
import { upgradePlans } from '../data/upgradePlans.js'

export default function Upgrade() {
  const [selectedPlan, setSelectedPlan] = useState(null)

  const onSelectOffer = (plan) => {
    if (!plan) return
    setSelectedPlan(plan)
  }

  const closeModal = () => setSelectedPlan(null)

  return (
    <div className="upgrade-page">
      <header className="upgrade-page__header">
        <h1>Upgrade Your Car Deal Coach Protection</h1>
        <p>Choose the plan that matches your buying timeline and get instant access to scripts, alerts, and AI coaching.</p>
      </header>

      <div className="upgrade-grid">
        {upgradePlans.map((plan) => (
          <PricingTile
            key={plan.id}
            price={plan.price}
            duration={plan.duration}
            title={plan.title}
            highlights={plan.highlights}
            cta={plan.cta}
            badge={plan.badge}
            featured={plan.featured}
            priceId={plan.priceId}
            onSelect={() => onSelectOffer(plan)}
          />
        ))}
      </div>

      <PaymentModal
        isOpen={Boolean(selectedPlan)}
        onClose={closeModal}
        type={selectedPlan?.mode === 'one-time' ? 'oneTime' : 'subscription'}
        planOverride={selectedPlan}
      />
    </div>
  )
}

function PricingTile({ price, duration, title, highlights, cta, badge, featured, priceId, onSelect }) {
  const isAvailable = Boolean(priceId)

  return (
    <div className={`pricing-tile ${featured ? 'is-featured' : ''}`}>
      {badge && <div className="pricing-tile__badge">{badge}</div>}
      <div className="pricing-tile__pricing">
        <span className="pricing-tile__price">{price}</span>
        <span className="pricing-tile__duration">{duration}</span>
      </div>
      <h2 className="pricing-tile__title">{title}</h2>
      <ul className="pricing-tile__highlights">
        {highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button
        className={`pricing-tile__cta ${featured ? 'pricing-tile__cta--featured' : ''}`}
        onClick={() => isAvailable && onSelect?.()}
        disabled={!isAvailable}
      >
        {cta || 'Purchase Now!'}
      </button>
      {!isAvailable && (
        <p className="pricing-tile__note">Contact support to enable this plan.</p>
      )}
    </div>
  )
}
