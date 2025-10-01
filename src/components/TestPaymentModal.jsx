import { useState } from 'react';

export default function TestPaymentModal({ isOpen, onClose, type = 'subscription' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (plan) => {
    setLoading(true);
    setError('');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success message
    alert(`🎉 Payment Successful!\n\nYou've selected: ${plan.name}\nPrice: ${plan.price}\nPeriod: ${plan.period}\n\nThis is a test - no real payment was processed.`);
    
    setLoading(false);
    onClose();
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
                onClick={() => handlePayment(plan)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  marginTop: 'auto',
                  backgroundColor: plan.popular ? '#3b82f6' : '#1e293b',
                  color: plan.popular ? 'white' : '#f8fafc',
                  border: plan.popular ? 'none' : '2px solid #3b82f6',
                  boxShadow: plan.popular ? '0 4px 6px -1px rgba(59, 130, 246, 0.3)' : '0 2px 4px -1px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = plan.popular ? '#2563eb' : '#3b82f6'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 12px -2px rgba(59, 130, 246, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = plan.popular ? '#3b82f6' : '#1e293b'
                    e.currentTarget.style.color = plan.popular ? 'white' : '#f8fafc'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = plan.popular ? '0 4px 6px -1px rgba(59, 130, 246, 0.3)' : '0 2px 4px -1px rgba(0, 0, 0, 0.3)'
                  }
                }}
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
          <p>🔒 Secure payment powered by Stripe</p>
          <p>Cancel anytime • No hidden fees</p>
          <p style={{ color: 'var(--success)', fontWeight: 'bold' }}>🧪 TEST MODE - No real payment processed</p>
        </div>
      </div>
    </div>
  );
}
