import React from 'react'
import { useSubscription } from '../hooks/useSubscription'
import { useHashRoute } from '../lib/routing'

const UpgradeNudge = ({ tier, feature, onUpgrade, compact = false }) => {
  if (compact) {
    return (
      <div className="feature-gate-compact">
        <div className="feature-gate-compact__content">
          <span className="feature-gate-compact__icon">🔒</span>
          <span className="feature-gate-compact__text">
            {feature ? `${feature} requires` : 'Requires'} {tier || 'subscription'}
          </span>
          <button 
            className="btn btn-sm btn-primary"
            onClick={onUpgrade}
          >
            Upgrade
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="feature-gate">
      <div className="feature-gate__content">
        <div className="feature-gate__icon">🚀</div>
        <h3>Unlock {feature || 'This Feature'}</h3>
        <p>
          {feature ? `${feature} is available` : 'This feature is available'} with {tier || 'a subscription'}.
        </p>
        <button 
          className="btn btn-primary"
          onClick={onUpgrade}
        >
          View Plans
        </button>
      </div>
    </div>
  )
}

export default function FeatureGate({ 
  children, 
  require = [], 
  fallback = null,
  feature = null,
  compact = false,
  showDemo = false
}) {
  const { hasAccess } = useSubscription()
  const { navigateTo } = useHashRoute()

  // Check access - if require is empty array, any active subscription works
  const hasRequiredAccess = hasAccess(require)

  if (hasRequiredAccess) {
    return children
  }

  // User doesn't have access
  if (fallback) {
    return fallback
  }

  // Show demo version if requested
  if (showDemo && React.isValidElement(children)) {
    return (
      <div className="feature-demo">
        <div className="feature-demo__overlay">
          <UpgradeNudge
            tier={require.length > 0 ? require.join(' or ') : 'subscription'}
            feature={feature}
            onUpgrade={() => navigateTo('upgrade')}
            compact={compact}
          />
        </div>
        <div className="feature-demo__content">
          {React.cloneElement(children, { disabled: true, readOnly: true })}
        </div>
      </div>
    )
  }

  // Default upgrade nudge
  return (
    <UpgradeNudge
      tier={require.length > 0 ? require.join(' or ') : 'subscription'}
      feature={feature}
      onUpgrade={() => navigateTo('upgrade')}
      compact={compact}
    />
  )
}

// Convenience components for common use cases
export const PremiumFeature = ({ children, ...props }) => (
  <FeatureGate require={['30d', '60d', '90d', 'annual']} {...props}>
    {children}
  </FeatureGate>
)

export const ProFeature = ({ children, ...props }) => (
  <FeatureGate require={['90d', 'annual']} {...props}>
    {children}
  </FeatureGate>
)

export const AnySubscription = ({ children, ...props }) => (
  <FeatureGate require={[]} {...props}>
    {children}
  </FeatureGate>
)
