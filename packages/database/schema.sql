-- Enable Row Level Security
-- Create tables

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar text,
  level int not null default 1,
  xp int not null default 0,
  gold int not null default 100,
  engagement int not null default 50,
  energy int not null default 70,
  stat_points int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Stats Table
create table public.stats (
  profile_id uuid references public.profiles(id) on delete cascade primary key,
  productivity int not null default 10,
  creativity int not null default 10,
  knowledge int not null default 10,
  experience int not null default 10,
  intelligence int not null default 10,
  resilience int not null default 10,
  updated_at timestamptz not null default now()
);

alter table public.stats enable row level security;

create policy "Users can view their own stats"
  on public.stats for select
  using (auth.uid() = profile_id);

create policy "Users can update their own stats"
  on public.stats for update
  using (auth.uid() = profile_id);

create policy "Users can insert their own stats"
  on public.stats for insert
  with check (auth.uid() = profile_id);

-- 3. Quests Table
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text not null, -- daily | weekly | monthly | challenge | recommendation
  rank text not null,     -- F | E | D | C | B | A | S
  xp_reward int not null,
  gold_reward int not null,
  stats_affected text[] not null,
  completed boolean not null default false,
  completed_at timestamptz,
  effort_level text default 'medium',
  completion_notes text,
  created_at timestamptz not null default now()
);

alter table public.quests enable row level security;

create policy "Users can view their own quests"
  on public.quests for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own quests"
  on public.quests for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own quests"
  on public.quests for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own quests"
  on public.quests for delete
  using (auth.uid() = profile_id);

-- 4. Assessment Responses Table
create table public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  raw_answers jsonb not null,
  computed_stats jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.assessment_responses enable row level security;

create policy "Users can view their own assessment responses"
  on public.assessment_responses for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own assessment responses"
  on public.assessment_responses for insert
  with check (auth.uid() = profile_id);

-- 5. Unlocked Skills Table
create table public.unlocked_skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  skill_name text not null,
  progress int not null default 0,
  unlocked_at timestamptz not null default now(),
  unique(profile_id, skill_name)
);

alter table public.unlocked_skills enable row level security;

create policy "Users can view their own unlocked skills"
  on public.unlocked_skills for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own unlocked skills"
  on public.unlocked_skills for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own unlocked skills"
  on public.unlocked_skills for update
  using (auth.uid() = profile_id);

-- 6. User Achievements Table
create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  unique(profile_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "Users can view their own achievements"
  on public.user_achievements for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own achievements"
  on public.user_achievements for insert
  with check (auth.uid() = profile_id);

-- 7. Purchased Rewards Table
create table public.purchased_rewards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  item_id text not null,
  item_name text not null,
  item_category text not null,
  cost int not null,
  purchased_at timestamptz not null default now()
);

alter table public.purchased_rewards enable row level security;

create policy "Users can view their own purchased rewards"
  on public.purchased_rewards for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own purchased rewards"
  on public.purchased_rewards for insert
  with check (auth.uid() = profile_id);

-- Trigger to automatically create a profile row for new auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar, level, xp, gold, engagement, energy, stat_points)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    1,
    0,
    100,
    50,
    70,
    0
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
