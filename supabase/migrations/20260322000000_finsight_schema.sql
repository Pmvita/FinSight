-- FinSight core schema: users, accounts, categories, transactions, budgets
-- Apply via `supabase db reset` / `supabase db push` or any Postgres client.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'analyst' check (role in ('admin', 'analyst', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  type text not null check (type in ('checking', 'savings', 'credit', 'investment', 'revenue', 'expense', 'asset')),
  balance numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  parent_id uuid references public.categories (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  amount numeric(14, 2) not null,
  description text not null default '',
  transaction_date date not null default current_date,
  status text not null default 'cleared' check (status in ('pending', 'cleared')),
  created_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  allocated_amount numeric(14, 2) not null,
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now(),
  check (period_end >= period_start)
);

create index if not exists idx_transactions_date on public.transactions (transaction_date);
create index if not exists idx_transactions_category on public.transactions (category_id);
create index if not exists idx_transactions_account on public.transactions (account_id);
create index if not exists idx_transactions_user on public.transactions (user_id);
create index if not exists idx_budgets_user_period on public.budgets (user_id, period_start, period_end);
create index if not exists idx_accounts_user on public.accounts (user_id);

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "accounts_own" on public.accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "categories_read" on public.categories
  for select using (true);

create policy "categories_write_auth" on public.categories
  for insert with check (auth.uid() is not null);

create policy "transactions_own" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "budgets_own" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
