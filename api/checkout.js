const Stripe = require('stripe')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20'
    })

    let body = req.body

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (parseError) {
        console.error('Failed to parse request body:', parseError)
        body = {}
      }
    }

    console.log('checkout body:', body)

    const priceId = body?.priceId
    const quantity = body?.quantity ?? 1
    const metadata = body?.metadata ?? {}
    const mode = body?.mode === 'payment' ? 'payment' : 'subscription'

    if (!priceId) {
      console.error('Missing priceId in checkout request')
      return res.status(400).json({ error: 'Missing priceId' })
    }

    console.log('using priceId:', priceId, 'mode:', mode)

    let price
    try {
      price = await stripe.prices.retrieve(priceId)
    } catch (err) {
      console.error('Stripe price lookup failed:', err)
      return res.status(404).json({ error: `Stripe price not found for id ${priceId}` })
    }

    if (!price?.active) {
      console.error('Stripe price inactive:', priceId)
      return res.status(400).json({ error: `Stripe price ${priceId} is inactive.` })
    }

    if (mode === 'payment' && price.type !== 'one_time') {
      console.warn('Mismatch: checkout mode payment but price is recurring')
    }
    if (mode === 'subscription' && price.type !== 'recurring') {
      console.warn('Mismatch: checkout mode subscription but price is one-time')
    }

    const origin = req.headers.origin || process.env.APP_URL || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity
        }
      ],
      allow_promotion_codes: true,
      success_url: `${origin}/#/upgrade?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/upgrade?status=cancelled`,
      metadata
    })

    return res.status(200).json({ id: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
