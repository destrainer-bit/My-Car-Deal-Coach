import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-06-20',
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

// Map Stripe price IDs to our tier names
const PRICE_TO_TIER_MAP: Record<string, string> = {
  'price_1SDFCfGGlhp8ceFI3DJvHpSX': '72h',    // 72 Hours – $19
  'price_1SDFBcGGlhp8ceFIxyJYot3l': '7d',     // 7 Days – $29
  'price_1SDFAnGGlhp8ceFIil6GisXL': '30d',    // 30 Days – $59
  'price_1SDFEqGGlhp8ceFIIQmwntoT': '60d',    // 60 Days – $79
  'price_1SDFDzGGlhp8ceFIydvjm413': '90d',    // 90 Days – $97
  'price_1SDXr3GGlhp8ceFI6GEUQIwL': 'annual', // 1 Year – $199
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response('Invalid signature', { status: 400 })
  }

  // Initialize Supabase admin client
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Helper function to update user subscription
  const updateSubscription = async (
    customerId: string,
    status: string,
    tier?: string,
    periodEnd?: number
  ) => {
    try {
      // Get the customer to find the Supabase user ID
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      const userId = customer?.metadata?.supabase_user_id

      if (!userId) {
        console.error('No Supabase user ID found in customer metadata:', customerId)
        return
      }

      // Calculate period end for one-time purchases (72h, 7d, etc.)
      let calculatedPeriodEnd: string | null = null
      if (periodEnd) {
        calculatedPeriodEnd = new Date(periodEnd * 1000).toISOString()
      } else if (tier && tier !== 'annual') {
        // For one-time purchases, calculate expiry based on tier
        const now = new Date()
        switch (tier) {
          case '72h':
            calculatedPeriodEnd = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString()
            break
          case '7d':
            calculatedPeriodEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
            break
          case '30d':
            calculatedPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
            break
          case '60d':
            calculatedPeriodEnd = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString()
            break
          case '90d':
            calculatedPeriodEnd = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString()
            break
        }
      }

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: status,
          subscription_tier: tier || null,
          current_period_end: calculatedPeriodEnd,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating profile:', error)
      } else {
        console.log(`Updated subscription for user ${userId}: ${status} (${tier})`)
      }
    } catch (error) {
      console.error('Error in updateSubscription:', error)
    }
  }

  // Handle different webhook events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Checkout session completed:', session.id)

      if (session.mode === 'payment') {
        // One-time payment completed
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = lineItems.data[0]?.price?.id
        const tier = priceId ? PRICE_TO_TIER_MAP[priceId] : undefined

        await updateSubscription(
          session.customer as string,
          'active',
          tier
        )
      } else if (session.mode === 'subscription' && session.subscription) {
        // Subscription created
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        const priceId = subscription.items.data[0]?.price?.id
        const tier = priceId ? PRICE_TO_TIER_MAP[priceId] : undefined

        await updateSubscription(
          session.customer as string,
          subscription.status,
          tier,
          subscription.current_period_end
        )
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const priceId = subscription.items.data[0]?.price?.id
      const tier = priceId ? PRICE_TO_TIER_MAP[priceId] : undefined

      await updateSubscription(
        subscription.customer as string,
        subscription.status,
        tier,
        subscription.current_period_end
      )
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await updateSubscription(
        subscription.customer as string,
        'canceled'
      )
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.customer) {
        await updateSubscription(
          invoice.customer as string,
          'past_due'
        )
      }
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.customer && invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
        const priceId = subscription.items.data[0]?.price?.id
        const tier = priceId ? PRICE_TO_TIER_MAP[priceId] : undefined

        await updateSubscription(
          invoice.customer as string,
          'active',
          tier,
          subscription.current_period_end
        )
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new Response('ok', { status: 200 })
})
