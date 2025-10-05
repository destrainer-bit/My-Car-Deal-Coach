import { useMemo, useState } from 'react';
import { redirectToCheckout } from '../lib/stripe';
import { upgradePlans } from '../data/upgradePlans.js';

export default function PaymentModal({
  isOpen,
  onClose,
  type = 'subscription',
  planOverride
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plansToShow = useMemo(() => {
    if (planOverride) {
      return [planOverride];
    }
    return upgradePlans.map((plan) => ({
      ...plan,
      planName: plan.title
    }));
  }, [planOverride]);

  const handlePayment = async (plan) => {
    if (!plan || !plan.priceId) {
      setError('Checkout is not available for this plan.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkoutMode = plan.mode === 'one-time' || type === 'oneTime' ? 'payment' : 'subscription';
      await redirectToCheckout(plan.priceId, checkoutMode);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPlans = plansToShow.map((plan) => ({
    ...plan,
    price: plan.price || '',
    duration: plan.duration || '',
    highlights: plan.highlights || [],
    cta: plan.cta || 'Purchase Now!'
  }));

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{planOverride ? 'Confirm Your Plan' : 'Choose Your Plan'}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <div className="payment-plans">
          {currentPlans.map((plan) => (
            <div key={plan.id} className={`payment-plan ${plan.featured ? 'popular' : ''}`}>
              {plan.badge && <div className="popular-badge">{plan.badge}</div>}

              <div className="plan-header">
                <h3>{plan.title || plan.name}</h3>
                {(plan.price || plan.duration) && (
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.duration}</span>
                  </div>
                )}
              </div>

              {plan.highlights.length > 0 && (
                <ul className="plan-features">
                  {plan.highlights.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              )}

              <button
                className={`plan-button ${plan.featured ? 'popular' : ''}`}
                onClick={() => handlePayment(plan)}
                disabled={loading || !plan.priceId}
              >
                {loading ? 'Processing...' : plan.cta}
              </button>

              {!plan.priceId && (
                <p className="pricing-tile__note" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                  Checkout unavailable – contact support.
                </p>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}

        <div className="payment-footer">
          <p>Secure payment powered by Stripe</p>
          <p>Cancel anytime • No hidden fees</p>
        </div>
      </div>
    </div>
  );
}


