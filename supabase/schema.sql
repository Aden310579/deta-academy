-- Jalankan sekali di Supabase → SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  member_until timestamptz,          -- null = bukan member premium
  created_at timestamptz default now()
);

create table if not exists public.progress (
  user_id uuid references auth.users on delete cascade,
  lesson_key text not null,          -- contoh: m3-l2
  done_at timestamptz default now(),
  primary key (user_id, lesson_key)
);

create table if not exists public.quiz_scores (
  user_id uuid references auth.users on delete cascade,
  module_id text not null,           -- contoh: m3
  best_score int not null default 0,
  updated_at timestamptz default now(),
  primary key (user_id, module_id)
);

create table if not exists public.orders (
  id text primary key,               -- order_id yang dikirim ke Midtrans
  user_id uuid references auth.users on delete set null,
  amount int not null,
  status text not null default 'pending',
  raw jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.quiz_scores enable row level security;
alter table public.orders enable row level security;

-- Murid hanya bisa membaca profilnya sendiri. Status premium hanya diubah server (service role).
create policy "profil sendiri" on public.profiles for select using (auth.uid() = id);
create policy "ubah nama sendiri" on public.profiles for update using (auth.uid() = id)
  with check (auth.uid() = id and member_until is not distinct from (select member_until from public.profiles p where p.id = auth.uid()));

create policy "progres sendiri" on public.progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "kuis sendiri" on public.quiz_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "order sendiri" on public.orders for select using (auth.uid() = user_id);

-- Buat profil otomatis saat murid mendaftar.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
