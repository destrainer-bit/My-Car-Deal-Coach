# Environment Variables Setup Guide

## Current Environment Variables

Your `.env` file should contain the following variables:

### AI & APIs
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDEyCtUVwcVxjiX9ubZ66jtVb132eby4hw
```

### Client (browser) - Supabase
```bash
VITE_SUPABASE_URL=https://hzbmvtceztbokundczra.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Client (browser) - Stripe
```bash
VITE_STRIPE_SUB_PRICE_ID=price_xxx
VITE_STRIPE_ONE_TIME_PRICE_ID=price_yyy
```

### Server (API) - Supabase
```bash
SUPABASE_URL=https://hzbmvtceztbokundczra.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Ym12dGNlenRib2t1bmRjenJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA2MzUzMSwiZXhwIjoyMDc0NjM5NTMxfQ.pPSZBmG2bQLvGRqR4UclX2HU65ItBrRVEPQq4Btwv80
```

### Server (API) - Stripe
```bash
STRIPE_SECRET_KEY=sk_test_xxx
```

### App Configuration
```bash
APP_URL=http://localhost:5173
```

## Missing Variables You Need to Add

### 1. Supabase Anonymous Key
- Go to your Supabase project dashboard
- Navigate to Settings > API
- Copy the "anon public" key
- Add to `.env`: `VITE_SUPABASE_ANON_KEY=your-anon-key-here`

### 2. Stripe Configuration
- Create a Stripe account at https://stripe.com
- Get your API keys from the Stripe dashboard
- Create products and prices for subscription and one-time payments
- Add to `.env`:
  - `VITE_STRIPE_SUB_PRICE_ID=price_xxx` (subscription price ID)
  - `VITE_STRIPE_ONE_TIME_PRICE_ID=price_yyy` (one-time payment price ID)
  - `STRIPE_SECRET_KEY=sk_test_xxx` (secret key for server-side)

## How to Update Your .env File

1. Open your `.env` file in a text editor
2. Add the missing variables above
3. Replace placeholder values with your actual keys
4. Save the file
5. Restart your development server: `npm run dev`

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use different keys for development and production
- For production, set these variables in your hosting platform (Vercel, Netlify, etc.)

## Testing Your Setup

After adding the variables, test each integration:

1. **OpenAI**: Check if the AI agent works in Settings
2. **Supabase**: Check if data loads and saves properly
3. **Google Maps**: Check if dealership locator works
4. **Stripe**: Test payment flows (use test mode first)


