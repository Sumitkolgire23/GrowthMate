create table if not exists public.purchased_rewards (
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
