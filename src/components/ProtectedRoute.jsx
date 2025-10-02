import React from 'react'
import { useSubscription } from '../hooks/useSubscription'
import { useHashRoute } from '../lib/routing'

const UpgradePrompt = ({ tier, onUpgrade }) => (
  <div className="upgrade-prompt">
    <div className="upgrade-prompt__content">
      <div className="upgrade-prompt__icon">🔒</div>
      <h2>Upgrade Required</h2>
      <p>
        You need an active subscription to access this feature. 
        {tier && ` This requires a ${tier} plan or higher.`}
      </p>
      <div className="upgrade-prompt__actions">
        <button 
          className="btn btn-primary"
          onClick={onUpgrade}
        >
          View Upgrade Options
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
)

export default function ProtectedRoute({ 
  children, 
  requiredTiers = [], 
  fallback = null,
  redirectTo = 'upgrade'
}) {
  const { loading, hasAccess } = useSubscription()
  const { navigateTo } = useHashRoute()

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking subscription...</p>
      </div>
    )
  }

  // Check if user has required access
  const hasRequiredAccess = hasAccess(requiredTiers)

  if (!hasRequiredAccess) {
    // Use custom fallback if provided
    if (fallback) {
      return fallback
    }

    // Default upgrade prompt
    return (
      <UpgradePrompt
        tier={requiredTiers.length > 0 ? requiredTiers.join(' or ') : null}
        onUpgrade={() => navigateTo(redirectTo)}
      />
    )
  }

  // User has access, render the protected content
  return children
}
