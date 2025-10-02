-- Car Deal Coach Subscription Setup
-- Run this in your Supabase SQL Editor

-- 1) Create profiles table with subscription fields
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  subscription_status text check (subscription_status in ('active','trialing','past_due','canceled','incomplete')),
  subscription_tier text check (subscription_tier in ('72h','7d','30d','60d','90d','annual')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end; $$ language plpgsql security definer;

-- 3) Trigger to create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4) Enable Row Level Security
alter table public.profiles enable row level security;

-- 5) RLS Policies
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 6) Function to check if user has active subscription
create or replace function public.has_active_subscription(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id
    and subscription_status in ('active', 'trialing')
    and (current_period_end is null or current_period_end > now())
  );
end; $$ language plpgsql security definer;

-- 7) Function to check subscription tier access
create or replace function public.has_tier_access(user_id uuid, required_tiers text[])
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id
    and subscription_status in ('active', 'trialing')
    and (current_period_end is null or current_period_end > now())
    and subscription_tier = any(required_tiers)
  );
end; $$ language plpgsql security definer;

-- 8) Create indexes for performance
create index if not exists profiles_stripe_customer_id_idx on public.profiles(stripe_customer_id);
create index if not exists profiles_subscription_status_idx on public.profiles(subscription_status);
create index if not exists profiles_subscription_tier_idx on public.profiles(subscription_tier);

-- 9) Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant execute on function public.has_active_subscription to anon, authenticated;
grant execute on function public.has_tier_access to anon, authenticated;
