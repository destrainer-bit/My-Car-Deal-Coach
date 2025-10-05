import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  plan_name: string;
  amount: number;
  currency: string;
}

export default function BillingManagement() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    name: ''
  });

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      // Mock data - replace with actual API calls
      setPaymentMethods([
        {
          id: 'pm_1234567890',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          exp_month: 12,
          exp_year: 2025,
          is_default: true
        }
      ]);

      setSubscription({
        id: 'sub_1234567890',
        status: 'active',
        current_period_start: '2024-01-01',
        current_period_end: '2024-02-01',
        plan_name: 'Car Deal Coach Pro',
        amount: 1999, // $19.99 in cents
        currency: 'usd'
      });
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would integrate with Stripe to add a new payment method
      console.log('Adding new card:', newCard);
      alert('Payment method added successfully!');
      setShowAddCard(false);
      setNewCard({ number: '', exp_month: '', exp_year: '', cvc: '', name: '' });
      loadBillingData();
    } catch (error) {
      alert('Error adding payment method. Please try again.');
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      // Update default payment method
      console.log('Setting default payment method:', paymentMethodId);
      alert('Default payment method updated!');
      loadBillingData();
    } catch (error) {
      alert('Error updating payment method. Please try again.');
    }
  };

  const handleRemoveCard = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;
    
    try {
      console.log('Removing payment method:', paymentMethodId);
      alert('Payment method removed successfully!');
      loadBillingData();
    } catch (error) {
      alert('Error removing payment method. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) return;
    
    try {
      console.log('Canceling subscription');
      alert('Subscription canceled. You will retain access until the end of your billing period.');
      navigate('/app/settings');
    } catch (error) {
      alert('Error canceling subscription. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading billing information...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/app/settings')}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            ← Back to Settings
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            💳 Manage Billing
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Update your payment methods and manage your subscription
          </p>
        </div>

        {/* Current Subscription */}
        {subscription && (
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
              Current Subscription
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Plan</div>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>{subscription.plan_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Amount</div>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>
                  ${(subscription.amount / 100).toFixed(2)} {subscription.currency.toUpperCase()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</div>
                <div style={{ 
                  fontWeight: '500', 
                  color: subscription.status === 'active' ? '#059669' : '#dc2626',
                  textTransform: 'capitalize'
                }}>
                  {subscription.status}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Next Billing</div>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleCancelSubscription}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Payment Methods
            </h2>
            <button
              onClick={() => setShowAddCard(!showAddCard)}
              style={{
                background: '#059669',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              + Add Payment Method
            </button>
          </div>

          {/* Add Card Form */}
          {showAddCard && (
            <form onSubmit={handleAddCard} style={{
              background: '#f9fafb',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Add New Card
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={newCard.number}
                    onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                    Expiry Month
                  </label>
                  <input
                    type="text"
                    value={newCard.exp_month}
                    onChange={(e) => setNewCard({...newCard, exp_month: e.target.value})}
                    placeholder="12"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                    Expiry Year
                  </label>
                  <input
                    type="text"
                    value={newCard.exp_year}
                    onChange={(e) => setNewCard({...newCard, exp_year: e.target.value})}
                    placeholder="2025"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                    CVC
                  </label>
                  <input
                    type="text"
                    value={newCard.cvc}
                    onChange={(e) => setNewCard({...newCard, cvc: e.target.value})}
                    placeholder="123"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={newCard.name}
                    onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    background: '#059669',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Add Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Existing Payment Methods */}
          {paymentMethods.map((method) => (
            <div key={method.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              marginBottom: '0.5rem',
              background: method.is_default ? '#f0f9ff' : 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '25px',
                  background: method.brand === 'visa' ? '#1a1f71' : '#0066cc',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {method.brand?.toUpperCase() || 'CARD'}
                </div>
                <div>
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>
                    •••• •••• •••• {method.last4}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Expires {method.exp_month}/{method.exp_year}
                    {method.is_default && ' • Default'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!method.is_default && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    style={{
                      background: '#059669',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleRemoveCard(method.id)}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {paymentMethods.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No payment methods on file. Add one to get started.
            </div>
          )}
        </div>

        {/* Billing History */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
            Billing History
          </h2>
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <div>No billing history available</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Your invoices and receipts will appear here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
