# 🚀 Car Deal Coach - Complete Setup Guide

## ✅ **What's Already Working (No Setup Needed)**

Your app is fully functional with:
- ✅ **PWA capabilities** (installable, offline)
- ✅ **Real Google Maps integration** (dealer finder, directions)
- ✅ **Mock AI agent** (demo mode - works without API keys)
- ✅ **All core features** (deals, checklist, notes, settings)

## 🎯 **What I Need From You (Optional - For Full AI Features)**

To enable the real AI agent, you'll need these API keys:

### **1. OpenAI API Key (For AI Agent)**
- **Cost**: ~$5-20/month for typical usage
- **Get it**: Go to [platform.openai.com](https://platform.openai.com)
- **Steps**:
  1. Create account
  2. Go to API Keys section
  3. Create new key
  4. Copy the key (starts with `sk-`)

### **2. Supabase Account (For AI Memory)**
- **Cost**: Free tier available
- **Get it**: Go to [supabase.com](https://supabase.com)
- **Steps**:
  1. Create new project
  2. Go to Settings > API
  3. Copy Project URL and Service Role Key
  4. Run the SQL commands I'll provide below

## 🔧 **Setup Steps (If You Want Full AI Features)**

### **Step 1: Supabase Setup**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor and run this:

```sql
-- Create tables for AI agent
create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  goal text not null,
  status text not null default 'running',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists agent_messages (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references agent_runs(id) on delete cascade,
  role text not null,
  content jsonb not null,
  created_at timestamptz default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  notes text
);
```

### **Step 2: Create Environment File**
Create a file called `.env` in your project root:

```bash
# OpenAI API Key (get from platform.openai.com)
VITE_OPENAI_API_KEY=sk-your-actual-key-here

# Supabase (get from your Supabase project settings)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google Maps (already working)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDEyCtUVwcVxjiX9ubZ66jtVb132eby4hw
```

### **Step 3: Switch to Real Agent**
Once you have the API keys, change this line in `src/pages/Settings.jsx`:

```javascript
// Change from:
import MockNegotiatorPanel from '../components/MockNegotiatorPanel.jsx'

// To:
import NegotiatorAgentPanel from '../components/NegotiatorAgentPanel.jsx'
```

And update the component usage:
```javascript
// Change from:
<MockNegotiatorPanel />

// To:
<NegotiatorAgentPanel />
```

## 🎮 **Test Your App Right Now (No Setup Needed)**

1. **Open**: `http://localhost:5174` (or whatever port Vite shows)
2. **Go to Settings** page
3. **Scroll to "AI Negotiator Agent"**
4. **Try the demo** - it works without any API keys!

## 📱 **Deploy to Production**

### **Option 1: Vercel (Recommended)**
1. Push your code to GitHub
2. Connect to [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### **Option 2: Netlify**
1. Connect to [netlify.com](https://netlify.com)
2. Add environment variables
3. Deploy!

## 🎯 **Current Status**

### **✅ Working Now (No Setup)**
- Full car deal management
- Google Maps integration
- PWA capabilities
- Mock AI agent (demo mode)
- All core features

### **🔧 Optional (With API Keys)**
- Real AI negotiation agent
- Persistent AI memory
- Advanced AI features

## 💡 **Recommendation**

**Start with the current setup!** Your app is fully functional with:
- Real Google Maps (dealer finder, directions)
- PWA capabilities (installable, offline)
- Mock AI agent (shows how it would work)

You can always add the real AI features later when you're ready to invest in the API costs.

## 🆘 **Need Help?**

1. **Test the mock agent** - it shows exactly how the real one would work
2. **Check the console** - any errors will show there
3. **Try the Google Maps features** - they're already working with your API key
4. **Install the PWA** - look for the install prompt in your browser

Your Car Deal Coach is ready to use! 🚗💰




