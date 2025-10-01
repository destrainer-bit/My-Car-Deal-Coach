# Stripe Payment Integration Setup

This guide will help you set up Stripe payments for The Car Deal Coach app.

## 🚀 Quick Setup

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Switch to **Test Mode** (toggle in the top right)

### 2. Get Your API Keys
1. Go to **Developers** → **API Keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 3. Create Products and Prices
1. Go to **Products** in your Stripe dashboard
2. Create the following products:

#### Quick Access (72 Hours)
- **Name**: "Car Deal Coach - Quick Access"
- **Description**: "72-hour access to AI negotiations and basic features"
- **Pricing**: $19 for 72 hours
- **Copy the Price ID** (starts with `price_`)

#### Weekly Pro (7 Days)
- **Name**: "Car Deal Coach - Weekly Pro"
- **Description**: "7-day access with advanced market insights"
- **Pricing**: $29 for 7 days
- **Copy the Price ID** (starts with `price_`)

#### Monthly Pro (30 Days)
- **Name**: "Car Deal Coach - Monthly Pro"
- **Description**: "30-day access with unlimited AI negotiations"
- **Pricing**: $59 for 30 days
- **Copy the Price ID** (starts with `price_`)

#### Extended Pro (60 Days)
- **Name**: "Car Deal Coach - Extended Pro"
- **Description**: "60-day access with premium negotiation scripts"
- **Pricing**: $79 for 60 days
- **Copy the Price ID** (starts with `price_`)

#### Ultimate Pro (90 Days)
- **Name**: "Car Deal Coach - Ultimate Pro"
- **Description**: "90-day access with lifetime deal tracking"
- **Pricing**: $97 for 90 days
- **Copy the Price ID** (starts with `price_`)

#### One-Time Premium
- **Name**: "Car Deal Coach Premium Features"
- **Description**: "One-time purchase of premium negotiation tools"
- **Pricing**: $19.99 one-time
- **Copy the Price ID** (starts with `price_`)

### 4. Update Environment Variables
Replace the placeholder values in your `.env` file:

```bash
# Stripe Configuration - Updated Pricing
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
VITE_STRIPE_72HOURS_PRICE_ID=price_your_72hours_price_id
VITE_STRIPE_7DAYS_PRICE_ID=price_your_7days_price_id
VITE_STRIPE_30DAYS_PRICE_ID=price_your_30days_price_id
VITE_STRIPE_60DAYS_PRICE_ID=price_your_60days_price_id
VITE_STRIPE_90DAYS_PRICE_ID=price_your_90days_price_id
VITE_STRIPE_ONE_TIME_PRICE_ID=price_your_onetime_price_id
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

### 5. Test the Integration
1. Restart your development server: `npm run dev`
2. Go to Settings → Premium Features
3. Click "View Plans" or "Buy Now"
4. Test the payment flow with Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`

## 🔧 Advanced Configuration

### Webhook Setup (Optional)
For production, set up webhooks to handle payment events:

1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`
4. Copy the webhook signing secret

### Customer Portal
The app includes a customer portal for subscription management. Users can:
- Update payment methods
- Cancel subscriptions
- Download invoices
- View billing history

## 💳 Payment Features

### Subscription Plans
- **Quick Access**: $19 for 72 hours
  - AI negotiation assistance
  - Basic market data
  - Priority support
  - Quick deal analysis

- **Weekly Pro**: $29 for 7 days
  - Everything in 72 hours
  - Advanced market insights
  - Deal comparison tools
  - Export capabilities

- **Monthly Pro**: $59 for 30 days
  - Everything in Weekly
  - Unlimited AI negotiations
  - Advanced analytics
  - Priority support

- **Extended Pro**: $79 for 60 days
  - Everything in Monthly
  - Premium negotiation scripts
  - Market trend analysis
  - Advanced reporting

- **Ultimate Pro**: $97 for 90 days
  - Everything in Extended
  - Lifetime deal tracking
  - Advanced market intelligence
  - Premium support

### One-Time Purchases
- **Premium Features**: $19.99
  - Advanced negotiation scripts
  - Market analysis tools
  - Priority support
  - Lifetime access

## 🚀 Production Deployment

### 1. Switch to Live Mode
1. In Stripe dashboard, toggle to **Live Mode**
2. Get your live API keys
3. Update environment variables with live keys

### 2. Update Vercel Environment Variables
1. Go to your Vercel project settings
2. Add the live Stripe keys:
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_MONTHLY_PRICE_ID`
   - `VITE_STRIPE_YEARLY_PRICE_ID`
   - `VITE_STRIPE_ONE_TIME_PRICE_ID`
   - `STRIPE_SECRET_KEY`

### 3. Test with Real Cards
Use your own credit card to test the live integration.

## 🔒 Security Notes

- Never commit real API keys to version control
- Use environment variables for all sensitive data
- Test thoroughly in test mode before going live
- Monitor your Stripe dashboard for any issues

## 📊 Analytics

Track your payments in the Stripe dashboard:
- Revenue analytics
- Customer metrics
- Failed payment insights
- Subscription churn

## 🆘 Troubleshooting

### Common Issues
1. **"Invalid API key"**: Check your environment variables
2. **"Price not found"**: Verify your price IDs are correct
3. **Payment fails**: Check your Stripe account status
4. **Modal doesn't open**: Check browser console for errors

### Support
- Stripe Documentation: [stripe.com/docs](https://stripe.com/docs)
- Stripe Support: Available in your dashboard
- Test Cards: [stripe.com/docs/testing](https://stripe.com/docs/testing)

## 🎯 Next Steps

1. Set up your Stripe account
2. Create products and prices
3. Update environment variables
4. Test the payment flow
5. Deploy to production
6. Monitor payments and analytics

Your Car Deal Coach app is now ready to accept payments! 🚗💳
