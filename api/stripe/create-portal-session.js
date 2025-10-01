// Vercel API function for creating Stripe customer portal sessions
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { returnUrl } = req.body;

    // In a real app, you'd get the customer ID from the authenticated user
    // For now, we'll use a placeholder - you'll need to implement user authentication
    const customerId = 'cus_placeholder'; // Replace with actual customer ID

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.APP_URL}/#/settings`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal session error:', error);
    res.status(500).json({ error: error.message });
  }
}


