-- Car Deal Coach AI Agent Database Setup
-- Run this in your Supabase SQL Editor

-- Create tables for AI agent
create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  goal text not null,
  status text not null default 'running', -- running|done|error
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Message log / tool calls / results
create table if not exists agent_messages (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references agent_runs(id) on delete cascade,
  role text not null, -- system|user|assistant|tool
  content jsonb not null,
  created_at timestamptz default now()
);

-- Optional: contacts
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  notes text
);

-- Enable Row Level Security (RLS)
alter table agent_runs enable row level security;
alter table agent_messages enable row level security;
alter table contacts enable row level security;

-- Create policies for service role access
create policy "Service role can access all data" on agent_runs
  for all using (true);

create policy "Service role can access all data" on agent_messages
  for all using (true);

create policy "Service role can access all data" on contacts
  for all using (true);

-- Create indexes for better performance
create index if not exists idx_agent_messages_run_id on agent_messages(run_id);
create index if not exists idx_agent_messages_created_at on agent_messages(created_at);
create index if not exists idx_agent_runs_status on agent_runs(status);


