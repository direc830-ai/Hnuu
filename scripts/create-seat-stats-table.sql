-- Run this in your Supabase Dashboard → SQL Editor

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

alter table public.seat_stats enable row level security;

drop policy if exists "Seat stats viewable by all" on public.seat_stats;
create policy "Seat stats viewable by all"
  on public.seat_stats for select using (true);

drop policy if exists "Seat stats insertable by authenticated" on public.seat_stats;
create policy "Seat stats insertable by authenticated"
  on public.seat_stats for insert with check (auth.uid() is not null);

drop policy if exists "Seat stats updatable by authenticated" on public.seat_stats;
create policy "Seat stats updatable by authenticated"
  on public.seat_stats for update using (auth.uid() is not null);
