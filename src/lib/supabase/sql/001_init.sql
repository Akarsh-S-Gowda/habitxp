-- Extensions
create extension if not exists pgcrypto;

-- Profiles (1 row per auth user)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) >= 1 and char_length(name) <= 120),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward integer not null check (xp_reward >= 1 and xp_reward <= 500),
  reminder_time time,
  streak_count integer not null default 0 check (streak_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_habits_user_id on public.habits(user_id);
create index if not exists idx_habits_created_at on public.habits(created_at desc);

-- Habit completions (1 completion per habit per day)
create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completion_date date not null default (now() at time zone 'utc')::date,
  completed_at timestamptz not null default now(),
  xp_gained integer not null check (xp_gained >= 0),
  created_at timestamptz not null default now(),
  unique (habit_id, completion_date)
);

create index if not exists idx_completions_user_date on public.habit_completions(user_id, completion_date desc);
create index if not exists idx_completions_habit_id on public.habit_completions(habit_id);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_habits_updated_at on public.habits;
create trigger set_habits_updated_at
before update on public.habits
for each row execute function public.set_updated_at();

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = user_id);

-- Habits policies
drop policy if exists "habits_select_own" on public.habits;
create policy "habits_select_own" on public.habits
for select using (auth.uid() = user_id);

drop policy if exists "habits_insert_own" on public.habits;
create policy "habits_insert_own" on public.habits
for insert with check (auth.uid() = user_id);

drop policy if exists "habits_update_own" on public.habits;
create policy "habits_update_own" on public.habits
for update using (auth.uid() = user_id);

drop policy if exists "habits_delete_own" on public.habits;
create policy "habits_delete_own" on public.habits
for delete using (auth.uid() = user_id);

-- Completions policies
drop policy if exists "completions_select_own" on public.habit_completions;
create policy "completions_select_own" on public.habit_completions
for select using (auth.uid() = user_id);

drop policy if exists "completions_insert_own" on public.habit_completions;
create policy "completions_insert_own" on public.habit_completions
for insert with check (auth.uid() = user_id);

drop policy if exists "completions_delete_own" on public.habit_completions;
create policy "completions_delete_own" on public.habit_completions
for delete using (auth.uid() = user_id);
