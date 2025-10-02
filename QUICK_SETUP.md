# 🚀 Quick Setup - Real AI Agent

## ✅ **Step 1: Create Environment File**

Create a file called `.env` in your project root with your API keys:

```bash
# OpenAI API Key
VITE_OPENAI_API_KEY=OPENAI_API_KEY

# Supabase Configuration  
VITE_SUPABASE_URL=https://hzbmvtceztbokundczra.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Ym12dGNlenRib2t1bmRjenJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA2MzUzMSwiZXhwIjoyMDc0NjM5NTMxfQ.pPSZBmG2bQLvGRqR4UclX2HU65ItBrRVEPQq4Btwv80

# Google Maps API (already working)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDEyCtUVwcVxjiX9ubZ66jtVb132eby4hw
```

## ✅ **Step 2: Set Up Supabase Database**

1. Go to your Supabase project: https://hzbmvtceztbokundczra.supabase.co
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to create the tables

## ✅ **Step 3: Restart Your App**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🎯 **Test Your Real AI Agent**

1. **Open**: `http://localhost:5173` (or whatever port shows)
2. **Go to Settings** → Scroll to "AI Negotiator Agent"
3. **Try a goal** like: "Get OTD for 2020 Honda Civic ≤ $25,000"
4. **Click "Run Step"** - The real AI will work!

## 🔧 **Troubleshooting**

### If you get API errors:
- Check that your `.env` file is in the project root
- Make sure you restarted the dev server after creating `.env`
- Check the browser console for specific error messages

### If Supabase errors:
- Make sure you ran the SQL setup script
- Check that your service role key is correct
- Verify the Supabase URL is correct

## 🎉 **You're Done!**

Your Car Deal Coach now has a real AI negotiation agent that can:
- ✅ Analyze car deals and pricing
- ✅ Calculate OTD costs with all fees
- ✅ Generate negotiation strategies
- ✅ Remember context from previous interactions
- ✅ Provide step-by-step negotiation guidance

**Test it out and let me know how it works!** 🚗💰🤖




