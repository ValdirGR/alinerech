create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  status text not null check (status in ('draft', 'published')),
  version integer not null default 1,
  content jsonb not null default '{}'::jsonb,
  is_current boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists site_sections_current_status_idx
  on public.site_sections (section_key, status)
  where is_current = true;

create index if not exists site_sections_lookup_idx
  on public.site_sections (section_key, status, is_current, updated_at desc);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text,
  source text not null default 'site_contact_form',
  status text not null default 'new' check (status in ('new', 'in_contact', 'converted', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_status_created_idx
  on public.leads (status, created_at desc);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  bucket_name text not null default 'site-images',
  file_path text not null unique,
  public_url text not null,
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
      and is_active = true
  );
$$;

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_sections_updated_at on public.site_sections;
create trigger set_site_sections_updated_at
before update on public.site_sections
for each row
execute function public.set_updated_at();

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.site_sections enable row level security;
alter table public.leads enable row level security;
alter table public.media_assets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_profiles'
      and policyname = 'Admins can view profiles'
  ) then
    create policy "Admins can view profiles"
      on public.admin_profiles
      for select
      to authenticated
      using (public.is_admin_user());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_profiles'
      and policyname = 'Admins manage profiles'
  ) then
    create policy "Admins manage profiles"
      on public.admin_profiles
      for all
      to authenticated
      using (public.is_admin_user())
      with check (public.is_admin_user());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'site_sections'
      and policyname = 'Public reads published sections'
  ) then
    create policy "Public reads published sections"
      on public.site_sections
      for select
      to anon, authenticated
      using (status = 'published' and is_current = true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'site_sections'
      and policyname = 'Admins manage sections'
  ) then
    create policy "Admins manage sections"
      on public.site_sections
      for all
      to authenticated
      using (public.is_admin_user())
      with check (public.is_admin_user());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and policyname = 'Public creates leads'
  ) then
    create policy "Public creates leads"
      on public.leads
      for insert
      to anon, authenticated
      with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and policyname = 'Admins read leads'
  ) then
    create policy "Admins read leads"
      on public.leads
      for select
      to authenticated
      using (public.is_admin_user());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and policyname = 'Admins update leads'
  ) then
    create policy "Admins update leads"
      on public.leads
      for update
      to authenticated
      using (public.is_admin_user())
      with check (public.is_admin_user());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'media_assets'
      and policyname = 'Admins manage media'
  ) then
    create policy "Admins manage media"
      on public.media_assets
      for all
      to authenticated
      using (public.is_admin_user())
      with check (public.is_admin_user());
  end if;
end
$$;

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('results-images', 'results-images', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public reads site images'
  ) then
    create policy "Public reads site images"
      on storage.objects
      for select
      to anon, authenticated
      using (bucket_id in ('site-images', 'results-images'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins upload site images'
  ) then
    create policy "Admins upload site images"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id in ('site-images', 'results-images')
        and public.is_admin_user()
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins update site images'
  ) then
    create policy "Admins update site images"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id in ('site-images', 'results-images')
        and public.is_admin_user()
      )
      with check (
        bucket_id in ('site-images', 'results-images')
        and public.is_admin_user()
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins delete site images'
  ) then
    create policy "Admins delete site images"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id in ('site-images', 'results-images')
        and public.is_admin_user()
      );
  end if;
end
$$;