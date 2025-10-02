# Car Deal Coach - Subscription System Deployment Guide

This guide will help you deploy the complete subscription system using React + Supabase + Stripe.

## 🗄️ Database Setup

1. **Run the SQL setup in Supabase**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-subscription-setup.sql`
   - Execute the SQL to create tables, functions, and policies

## 🔧 Supabase Edge Functions

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Deploy the Edge Functions**:
   ```bash
   # Deploy all functions
   supabase functions deploy create-stripe-customer
   supabase functions deploy create-checkout
   supabase functions deploy stripe-webhook
   ```

5. **Set Environment Variables for Edge Functions**:
   ```bash
   # Set Stripe secret key
   supabase secrets set STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   
   # Set webhook secret (get this from Stripe dashboard)
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Set Supabase service role key
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 🔗 Stripe Webhook Configuration

1. **Get your webhook URL**:
   - Your webhook URL will be: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`

2. **Configure in Stripe Dashboard**:
   - Go to Stripe Dashboard → Webhooks
   - Click "Add endpoint"
   - Enter your webhook URL
   - Select these events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
     - `invoice.payment_succeeded`
   - Copy the webhook signing secret and set it as `STRIPE_WEBHOOK_SECRET`

## 🌐 Frontend Environment Variables

Update your `.env` file with:

```env
# Existing Stripe keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key

# Supabase (if not already set)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Price IDs for your tiers
VITE_STRIPE_72HOURS_PRICE_ID=price_1SDFCfGGlhp8ceFI3DJvHpSX
VITE_STRIPE_7DAYS_PRICE_ID=price_1SDFBcGGlhp8ceFIxyJYot3l
VITE_STRIPE_30DAYS_PRICE_ID=price_1SDFAnGGlhp8ceFIil6GisXL
VITE_STRIPE_60DAYS_PRICE_ID=price_1SDFEqGGlhp8ceFIIQmwntoT
VITE_STRIPE_90DAYS_PRICE_ID=price_1SDFDzGGlhp8ceFIydvjm413
VITE_STRIPE_YEARLY_PRICE_ID=price_1SDXr3GGlhp8ceFI6GEUQIwL
```

## 🔐 Supabase Client Setup

Create `src/lib/supabaseClient.js` if it doesn't exist:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🚀 Implementation Examples

### 1. Protect a Route
```jsx
import ProtectedRoute from '../components/ProtectedRoute'

// Protect entire app
<ProtectedRoute>
  <AppShell />
</ProtectedRoute>

// Require specific tiers
<ProtectedRoute requiredTiers={['90d', 'annual']}>
  <PremiumFeature />
</ProtectedRoute>
```

### 2. Gate Features by Tier
```jsx
import FeatureGate, { PremiumFeature, ProFeature } from '../components/FeatureGate'

// Any active subscription
<FeatureGate>
  <MarketAnalytics />
</FeatureGate>

// Specific tiers required
<PremiumFeature feature="Advanced Analytics">
  <AdvancedAnalytics />
</PremiumFeature>

// Show demo with upgrade prompt
<FeatureGate require={['90d', 'annual']} showDemo feature="AI Negotiator">
  <AICoach />
</FeatureGate>
```

### 3. Start Checkout
```jsx
import { useSubscription } from '../hooks/useSubscription'

function UpgradeButton({ priceId, planName }) {
  const { startCheckout, loading } = useSubscription()
  
  const handleUpgrade = async () => {
    try {
      await startCheckout(priceId, {
        successUrl: `${window.location.origin}/app?upgrade=success`,
        cancelUrl: `${window.location.origin}/pricing`
      })
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }
  
  return (
    <button onClick={handleUpgrade} disabled={loading}>
      Upgrade to {planName}
    </button>
  )
}
```

### 4. Check Subscription Status
```jsx
import { useSubscription } from '../hooks/useSubscription'

function UserDashboard() {
  const { subscription, hasAccess, loading } = useSubscription()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Status: {subscription.status}</p>
      <p>Tier: {subscription.tier}</p>
      
      {hasAccess(['90d', 'annual']) && (
        <PremiumDashboard />
      )}
    </div>
  )
}
```

## 🧪 Testing the System

1. **Test User Flow**:
   - Sign up a new user
   - Check that profile is created automatically
   - Try accessing protected features (should show upgrade prompt)
   - Complete a checkout flow
   - Verify subscription status updates
   - Test feature access with different tiers

2. **Test Webhooks**:
   - Use Stripe CLI to forward webhooks locally:
     ```bash
     stripe listen --forward-to https://your-project.supabase.co/functions/v1/stripe-webhook
     ```
   - Trigger test events in Stripe dashboard
   - Check Supabase logs for webhook processing

## 🔒 Security Checklist

- ✅ RLS policies enabled on profiles table
- ✅ Edge Functions use service role key for admin operations
- ✅ Webhook signature verification implemented
- ✅ Client-side checks backed by server-side validation
- ✅ Stripe customer IDs properly linked to Supabase users

## 📊 Monitoring

1. **Supabase Logs**: Monitor Edge Function execution
2. **Stripe Dashboard**: Track payments and subscription events
3. **Database**: Query profiles table for subscription analytics

## 🚨 Troubleshooting

### Common Issues:

1. **Webhook not working**:
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Check Supabase function logs

2. **User can't access features**:
   - Check subscription status in profiles table
   - Verify RLS policies
   - Check current_period_end for expiry

3. **Checkout fails**:
   - Ensure Stripe customer exists
   - Check price IDs are correct
   - Verify environment variables

### Debug Commands:

```sql
-- Check user subscription
SELECT * FROM profiles WHERE id = 'user-uuid';

-- Check all active subscriptions
SELECT * FROM profiles WHERE subscription_status = 'active';
```

## 🎯 Next Steps

After deployment:

1. Update your pricing page to use the new checkout flow
2. Add subscription status to user dashboard
3. Implement customer portal for subscription management
4. Add analytics to track conversion rates
5. Set up email notifications for subscription events

Your subscription system is now ready for production! 🎉
