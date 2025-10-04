import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type SyncBody = {
  email: string
  status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
  tier?: '72h' | '7d' | '30d' | '60d' | '90d' | 'annual'
  days?: number // override duration
  stripeCustomerId?: string
}

const TOKEN = Deno.env.get('SYNC_ADMIN_TOKEN') || ''

const computePeriodEnd = (tier?: string, daysOverride?: number): string | null => {
  const now = new Date()
  if (typeof daysOverride === 'number' && daysOverride > 0) {
    return new Date(now.getTime() + daysOverride * 24 * 60 * 60 * 1000).toISOString()
  }
  switch (tier) {
    case '72h':
      return new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString()
    case '7d':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    case '30d':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    case '60d':
      return new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString()
    case '90d':
      return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString()
    case 'annual':
      return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
    default:
      return null
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Simple admin token auth (custom header to avoid Supabase JWT verification)
  const token = req.headers.get('x-sync-token') || ''
  if (!TOKEN || token !== TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: SyncBody
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!body.email) {
    return new Response(JSON.stringify({ error: 'Missing email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Look up user by email
    const { data: userRes, error: userErr } = await supabaseAdmin.auth.admin.getUserByEmail(
      body.email
    )
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const userId = userRes.user.id

    const periodEnd = computePeriodEnd(body.tier, body.days)

    const { error: upErr } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: body.status || 'active',
        subscription_tier: body.tier ?? null,
        current_period_end: periodEnd,
        ...(body.stripeCustomerId ? { stripe_customer_id: body.stripeCustomerId } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (upErr) throw upErr

    return new Response(
      JSON.stringify({ ok: true, userId, tier: body.tier, periodEnd }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('sync-access error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})


