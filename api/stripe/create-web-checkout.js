// Vercel serverless function for web-based Stripe checkout
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { tier, price, period, customerEmail } = req.body

    // Define price IDs for different tiers
    const priceIds = {
      'basic-monthly': process.env.STRIPE_BASIC_MONTHLY_PRICE_ID,
      'basic-annual': process.env.STRIPE_BASIC_ANNUAL_PRICE_ID,
      'pro-monthly': process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      'pro-annual': process.env.STRIPE_PRO_ANNUAL_PRICE_ID
    }

    const priceId = priceIds[`${tier}-${period}`]
    
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid tier or period' })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL}/pricing`,
      customer_email: customerEmail,
      metadata: {
        tier: tier,
        period: period
      }
    })

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
