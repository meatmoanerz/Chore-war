-- Supabase Database Schema for Chore War
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  name text not null,
  avatar_emoji text default '👤',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Households table
create table if not exists public.households (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  invite_code text unique not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Household members table
create table if not exists public.household_members (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references public.households(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'member' check (role in ('admin', 'member', 'child')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(household_id, user_id)
);

-- Chores table
create table if not exists public.chores (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references public.households(id) on delete cascade not null,
  title text not null,
  description text,
  points integer not null default 10,
  estimated_minutes integer default 10,
  is_recurring boolean default false,
  recurrence_pattern text, -- 'daily', 'weekly', 'monthly'
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chore completions table
create table if not exists public.chore_completions (
  id uuid primary key default uuid_generate_v4(),
  chore_id uuid references public.chores(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  household_id uuid references public.households(id) on delete cascade not null,
  points_earned integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Goals table
create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references public.households(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade, -- null for family goals
  title text not null,
  target_points integer not null,
  reward text,
  is_family_goal boolean default false,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.chores enable row level security;
alter table public.chore_completions enable row level security;
alter table public.goals enable row level security;

-- RLS Policies for profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- RLS Policies for households
create policy "Users can view households they belong to" on public.households
  for select using (
    id in (select household_id from public.household_members where user_id = auth.uid())
  );

create policy "Users can create households" on public.households
  for insert with check (auth.uid() = created_by);

-- RLS Policies for household_members
create policy "Users can view members of their households" on public.household_members
  for select using (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );

create policy "Users can join households" on public.household_members
  for insert with check (auth.uid() = user_id);

create policy "Admins can manage household members" on public.household_members
  for delete using (
    household_id in (
      select household_id from public.household_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for chores
create policy "Users can view chores in their households" on public.chores
  for select using (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );

create policy "Users can create chores in their households" on public.chores
  for insert with check (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );

create policy "Users can update chores in their households" on public.chores
  for update using (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );

create policy "Users can delete chores they created" on public.chores
  for delete using (created_by = auth.uid());

-- RLS Policies for chore_completions
create policy "Users can view completions in their households" on public.chore_completions
  for select using (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );

create policy "Users can complete chores" on public.chore_completions
  for insert with check (auth.uid() = user_id);

-- RLS Policies for goals
create policy "Users can view goals in their households" on public.goals
  for select using (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );

create policy "Users can create goals in their households" on public.goals
  for insert with check (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );

create policy "Users can update goals in their households" on public.goals
  for update using (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );

-- Function to generate invite codes
create or replace function generate_invite_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- Trigger to auto-generate invite code
create or replace function set_invite_code()
returns trigger as $$
begin
  if new.invite_code is null or new.invite_code = '' then
    new.invite_code := generate_invite_code();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger households_invite_code_trigger
  before insert on public.households
  for each row
  execute function set_invite_code();

-- Function to get user's total points
create or replace function get_user_points(p_user_id uuid, p_household_id uuid)
returns integer as $$
begin
  return coalesce(
    (select sum(points_earned) from public.chore_completions
     where user_id = p_user_id and household_id = p_household_id),
    0
  );
end;
$$ language plpgsql security definer;

-- View for profiles with household members (for viewing other household members)
create policy "Users can view profiles of household members" on public.profiles
  for select using (
    user_id in (
      select hm.user_id from public.household_members hm
      where hm.household_id in (
        select household_id from public.household_members where user_id = auth.uid()
      )
    )
  );
