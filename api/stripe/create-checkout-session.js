// Vercel API function for creating Stripe checkout sessions
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, mode, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: mode || 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.APP_URL}/#/settings?payment=success`,
      cancel_url: cancelUrl || `${process.env.APP_URL}/#/settings?payment=cancelled`,
      metadata: {
        app: 'car-deal-coach',
        type: mode || 'subscription',
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
}


