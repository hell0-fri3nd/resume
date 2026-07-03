-- Row Level Security for the Prisma-managed `profiles` and `resumes` tables.
--
-- Run this in the Supabase SQL editor AFTER `npx prisma db push` has created
-- the tables. Prisma owns the table schema; this file only adds the foreign
-- keys to auth.users and the RLS policies.
--
-- Note: the app's server action already scopes every read/write to the
-- authenticated user, and Prisma connects with a role that bypasses RLS. These
-- policies are defense-in-depth for any direct (non-Prisma) access with the
-- anon/authenticated keys, which Supabase recommends for all public tables.

-- ============================ profiles ======================================
alter table public.profiles
  drop constraint if exists profiles_user_id_fkey;
alter table public.profiles
  add constraint profiles_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================ resumes ========================================
-- Tie resumes to Supabase auth users and cascade deletes.
alter table public.resumes
  drop constraint if exists resumes_user_id_fkey;
alter table public.resumes
  add constraint resumes_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.resumes enable row level security;

drop policy if exists "Users can read their own resumes" on public.resumes;
create policy "Users can read their own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own resumes" on public.resumes;
create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own resumes" on public.resumes;
create policy "Users can update their own resumes"
  on public.resumes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own resumes" on public.resumes;
create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);
