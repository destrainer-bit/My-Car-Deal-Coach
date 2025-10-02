# AI Agent Setup Guide

## Overview
The Car Deal Coach now includes "The Negotiator" - an AI-powered negotiation assistant that can help users with car deal negotiations.

## Prerequisites

### 1. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the following SQL in your Supabase SQL editor:

```sql
-- memory for runs
create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  goal text not null,
  status text not null default 'running', -- running|done|error
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- message log / tool calls / results
create table if not exists agent_messages (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references agent_runs(id) on delete cascade,
  role text not null, -- system|user|assistant|tool
  content jsonb not null,
  created_at timestamptz default now()
);

-- optional: contacts
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  notes text
);
```

### 2. Environment Variables
Create a `.env` file in your project root with:

```bash
# OpenAI API Key
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google Maps API (already configured)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDEyCtUVwcVxjiX9ubZ66jtVb132eby4hw
```

### 3. API Keys Needed

#### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and get an API key
3. Add it to your `.env` file

#### Supabase Keys
1. In your Supabase dashboard, go to Settings > API
2. Copy the Project URL and Service Role Key
3. Add them to your `.env` file

## Features

### The Negotiator Agent
- **Goal-based negotiation**: Set specific targets (e.g., "Get OTD ≤ $39,500")
- **Fee analysis**: Identifies and flags junk fees
- **Counter strategies**: Generates negotiation scripts
- **Memory system**: Remembers previous interactions
- **Math tools**: Calculates complex pricing scenarios
- **Web search**: Can research market data (stub implementation)

### Agent Tools
- **Math**: Safe mathematical calculations
- **Memory**: Store and retrieve negotiation data
- **Web Search**: Research market information
- **Email**: Send negotiation communications

## Usage

1. Go to Settings in the app
2. Scroll down to "AI Negotiator Agent"
3. Enter your negotiation goal
4. Click "Run Step" to execute the agent
5. The agent will work step-by-step toward your goal

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_OPENAI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### Testing
Test the agent with:
```bash
curl -X POST https://your-app.vercel.app/api/agent \
  -H 'Content-Type: application/json' \
  -d '{"goal":"Get OTD ≤ $39,500"}'
```

## File Structure

```
src/
├── agent/
│   ├── agent.js          # AI agent brain
│   └── tools.js          # Agent tools
├── lib/
│   └── supabaseServer.js # Server-side Supabase client
├── components/
│   └── NegotiatorAgentPanel.jsx # UI component
api/
└── agent.js              # Vercel API function
```

## Troubleshooting

### Common Issues
1. **"Unknown tool" error**: The agent requested a tool not defined in `tools.js`
2. **API connection failed**: Check environment variables
3. **Supabase errors**: Verify table creation and API keys

### Debug Mode
Check the browser console and network tab for detailed error messages.

## Next Steps

1. **Real API Integration**: Replace stub tools with real APIs
2. **Enhanced UI**: Better visualization of agent progress
3. **Deal Integration**: Connect agent to specific deals
4. **Advanced Tools**: Add more sophisticated negotiation tools





