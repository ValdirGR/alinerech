create schema if not exists private;

create or replace function private.is_admin_user(check_user_id uuid default auth.uid())
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.admin_profiles
    where user_id = check_user_id
      and is_active = true
      and role in ('admin', 'editor')
  );
end;
$$;

revoke all on function private.is_admin_user(uuid) from public;
grant execute on function private.is_admin_user(uuid) to authenticated;

drop policy if exists "Admins can view profiles" on public.admin_profiles;
drop policy if exists "Admins manage profiles" on public.admin_profiles;
drop policy if exists "Users can view own profile" on public.admin_profiles;

create policy "Users can view own profile"
  on public.admin_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Admins can view profiles"
  on public.admin_profiles
  for select
  to authenticated
  using ((select private.is_admin_user()));

create policy "Admins manage profiles"
  on public.admin_profiles
  for all
  to authenticated
  using ((select private.is_admin_user()))
  with check ((select private.is_admin_user()));

drop policy if exists "Admins manage sections" on public.site_sections;
create policy "Admins manage sections"
  on public.site_sections
  for all
  to authenticated
  using ((select private.is_admin_user()))
  with check ((select private.is_admin_user()));

drop policy if exists "Admins read leads" on public.leads;
create policy "Admins read leads"
  on public.leads
  for select
  to authenticated
  using ((select private.is_admin_user()));

drop policy if exists "Admins update leads" on public.leads;
create policy "Admins update leads"
  on public.leads
  for update
  to authenticated
  using ((select private.is_admin_user()))
  with check ((select private.is_admin_user()));

drop policy if exists "Admins manage media" on public.media_assets;
create policy "Admins manage media"
  on public.media_assets
  for all
  to authenticated
  using ((select private.is_admin_user()))
  with check ((select private.is_admin_user()));

drop policy if exists "Admins upload site images" on storage.objects;
create policy "Admins upload site images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id in ('site-images', 'results-images')
    and (select private.is_admin_user())
  );

drop policy if exists "Admins update site images" on storage.objects;
create policy "Admins update site images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id in ('site-images', 'results-images')
    and (select private.is_admin_user())
  )
  with check (
    bucket_id in ('site-images', 'results-images')
    and (select private.is_admin_user())
  );

drop policy if exists "Admins delete site images" on storage.objects;
create policy "Admins delete site images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id in ('site-images', 'results-images')
    and (select private.is_admin_user())
  );