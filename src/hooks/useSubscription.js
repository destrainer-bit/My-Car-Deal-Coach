import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSubscription() {
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState({
    status: null,
    tier: null,
    periodEnd: null,
    isActive: false,
    customerId: null
  })

  useEffect(() => {
    let mounted = true

    const fetchSubscription = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          if (mounted) {
            setSubscription({
              status: null,
              tier: null,
              periodEnd: null,
              isActive: false,
              customerId: null
            })
            setLoading(false)
          }
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_status, subscription_tier, current_period_end, stripe_customer_id')
          .eq('id', user.id)
          .single()

        if (mounted) {
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching subscription:', error)
          }

          const status = data?.subscription_status
          const tier = data?.subscription_tier
          const periodEnd = data?.current_period_end
          const customerId = data?.stripe_customer_id

          // Check if subscription is active
          const isActive = status === 'active' || status === 'trialing'
          const isNotExpired = !periodEnd || new Date(periodEnd) > new Date()

          setSubscription({
            status,
            tier,
            periodEnd,
            isActive: isActive && isNotExpired,
            customerId
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in fetchSubscription:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchSubscription()

    // Set up real-time subscription to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.new) {
            const status = payload.new.subscription_status
            const tier = payload.new.subscription_tier
            const periodEnd = payload.new.current_period_end
            const customerId = payload.new.stripe_customer_id

            const isActive = status === 'active' || status === 'trialing'
            const isNotExpired = !periodEnd || new Date(periodEnd) > new Date()

            setSubscription({
              status,
              tier,
              periodEnd,
              isActive: isActive && isNotExpired,
              customerId
            })
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  // Helper functions
  const hasAccess = (requiredTiers = []) => {
    if (!subscription.isActive) return false
    if (requiredTiers.length === 0) return true
    return requiredTiers.includes(subscription.tier)
  }

  const createStripeCustomer = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const supabaseBaseUrl = (import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '') : '')
      const endpoint = supabaseBaseUrl
        ? `${supabaseBaseUrl}/functions/v1/create-stripe-customer`
        : '/functions/v1/create-stripe-customer'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create Stripe customer')
      }

      const { customerId } = await response.json()
      return customerId
    } catch (error) {
      console.error('Error creating Stripe customer:', error)
      throw error
    }
  }

  const startCheckout = async (priceId, options = {}) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Ensure user has a Stripe customer ID
      if (!subscription.customerId) {
        await createStripeCustomer()
      }
      const supabaseBaseUrl = (import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '') : '')
      const checkoutUrl = supabaseBaseUrl
        ? `${supabaseBaseUrl}/functions/v1/create-checkout`
        : '/functions/v1/create-checkout'

      const response = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: options.successUrl || `${window.location.origin}/app?upgrade=success`,
          cancelUrl: options.cancelUrl || `${window.location.origin}/pricing`,
          mode: options.mode || 'payment'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error starting checkout:', error)
      throw error
    }
  }

  return {
    loading,
    subscription,
    hasAccess,
    createStripeCustomer,
    startCheckout,
    // Convenience getters
    isActive: subscription.isActive,
    tier: subscription.tier,
    status: subscription.status,
    periodEnd: subscription.periodEnd
  }
}