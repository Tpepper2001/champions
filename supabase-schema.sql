-- Supabase Schema for Champions' Leadership Global
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create table for storing website content & configuration
create table if not exists public.site_settings (
  id text primary key default 'content',
  content_json text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.site_settings enable row level security;

-- 3. Policy: Allow public read access to site settings
drop policy if exists "Allow public read access" on public.site_settings;
create policy "Allow public read access"
  on public.site_settings
  for select
  using (true);

-- 4. Policy: Allow public insert and update
drop policy if exists "Allow public insert and update" on public.site_settings;
create policy "Allow public insert and update"
  on public.site_settings
  for all
  using (true)
  with check (true);

-- 5. Enable Realtime broadcast for site_settings
alter publication supabase_realtime add table public.site_settings;
