import { useState } from 'react';
import { redirectToCheckout } from '../lib/stripe';

export default function PaymentModal({ isOpen, onClose, type = 'subscription' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (priceId) => {
    setLoading(true);
    setError('');
    
    try {
      await redirectToCheckout(priceId, type);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const plans = {
    subscription: [
      {
        id: '72hours',
        name: 'Quick Access',
        price: '$19',
        period: '72 hours',
        features: [
          'Smart negotiation assistance',
          'Basic market data',
          'Priority support',
          'Quick deal analysis'
        ],
        priceId: import.meta.env.VITE_STRIPE_72HOURS_PRICE_ID
      },
      {
        id: '7days',
        name: 'Weekly Pro',
        price: '$29',
        period: '7 days',
        features: [
          'Everything in 72 hours',
          'Advanced market insights',
          'Deal comparison tools',
          'Export capabilities'
        ],
        priceId: import.meta.env.VITE_STRIPE_7DAYS_PRICE_ID
      },
      {
        id: '30days',
        name: 'Monthly Pro',
        price: '$59',
        period: '30 days',
        features: [
          'Everything in Weekly',
          'Unlimited negotiations',
          'Advanced analytics',
          'Priority support'
        ],
        priceId: import.meta.env.VITE_STRIPE_30DAYS_PRICE_ID,
        popular: true
      },
      {
        id: '60days',
        name: 'Extended Pro',
        price: '$79',
        period: '60 days',
        features: [
          'Everything in Monthly',
          'Premium negotiation scripts',
          'Market trend analysis',
          'Advanced reporting'
        ],
        priceId: import.meta.env.VITE_STRIPE_60DAYS_PRICE_ID
      },
              {
                id: '90days',
                name: 'Ultimate Pro',
                price: '$97',
                period: '90 days',
                features: [
                  'Everything in Extended',
                  'Lifetime deal tracking',
                  'Advanced market intelligence',
                  'Premium support'
                ],
                priceId: import.meta.env.VITE_STRIPE_90DAYS_PRICE_ID
              },
              {
                id: 'yearly',
                name: 'Annual Pro',
                price: '$199',
                period: '1 year',
                features: [
                  'Everything in Ultimate',
                  'Full year of premium access',
                  'Priority customer support',
                  'Exclusive features & updates'
                ],
                priceId: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID,
                popular: true
              }
    ],
    oneTime: [
      {
        id: 'premium',
        name: 'Premium Features',
        price: '$19.99',
        period: 'one-time',
        features: [
          'Advanced negotiation scripts',
          'Market analysis tools',
          'Priority support',
          'Lifetime access'
        ],
        priceId: import.meta.env.VITE_STRIPE_ONE_TIME_PRICE_ID
      }
    ]
  };

  const currentPlans = plans[type] || plans.subscription;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Choose Your Plan</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="payment-plans">
          {currentPlans.map((plan) => (
            <div key={plan.id} className={`payment-plan ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
              </div>
              
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              
              <button 
                className={`plan-button ${plan.popular ? 'popular' : ''}`}
                onClick={() => handlePayment(plan.priceId)}
                disabled={loading || !plan.priceId}
              >
                {loading ? 'Processing...' : `Choose ${plan.name}`}
              </button>
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
