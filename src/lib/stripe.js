// Stripe client-side utilities
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn('Stripe publishable key not found. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file');
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Create checkout session for subscription
export const createCheckoutSession = async (priceId, mode = 'subscription') => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        mode,
        successUrl: `${window.location.origin}/#/settings?payment=success`,
        cancelUrl: `${window.location.origin}/#/settings?payment=cancelled`,
      }),
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (priceId, mode = 'subscription') => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const session = await createCheckoutSession(priceId, mode);
    
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

// Create customer portal session
export const createCustomerPortalSession = async () => {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: `${window.location.origin}/#/settings`,
      }),
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Redirect to customer portal
export const redirectToCustomerPortal = async () => {
  try {
    const session = await createCustomerPortalSession();
    window.location.href = session.url;
  } catch (error) {
    console.error('Error redirecting to customer portal:', error);
    throw error;
  }
};


