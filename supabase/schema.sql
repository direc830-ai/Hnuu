create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text not null default 'user',
  balance_credits integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  seat_id text not null,
  floor text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seat_stats (
  seat_id text not null,
  floor text not null,
  wifi text not null default 'unknown',
  outlet text not null default 'unknown',
  noise text not null default 'unknown',
  warmth text not null default 'unknown',
  updated_at timestamptz not null default now(),
  primary key (seat_id, floor)
);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.seat_stats enable row level security;

drop policy if exists "Seat stats viewable by all" on public.seat_stats;
create policy "Seat stats viewable by all"
  on public.seat_stats for select using (true);

drop policy if exists "Seat stats upsertable by authenticated" on public.seat_stats;
create policy "Seat stats upsertable by authenticated"
  on public.seat_stats for insert with check (auth.uid() is not null);

drop policy if exists "Seat stats updatable by authenticated" on public.seat_stats;
create policy "Seat stats updatable by authenticated"
  on public.seat_stats for update using (auth.uid() is not null);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles
  for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
  on public.profiles
  for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "Bookings are viewable by all authenticated users" on public.bookings;
create policy "Bookings are viewable by all authenticated users"
  on public.bookings
  for select
  using (auth.uid() is not null);

drop policy if exists "Bookings are insertable by owner" on public.bookings;
create policy "Bookings are insertable by owner"
  on public.bookings
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Bookings are updateable by owner" on public.bookings;
create policy "Bookings are updateable by owner"
  on public.bookings
  for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Bookings are deletable by owner" on public.bookings;
create policy "Bookings are deletable by owner"
  on public.bookings
  for delete
  using (auth.uid() = user_id or public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();