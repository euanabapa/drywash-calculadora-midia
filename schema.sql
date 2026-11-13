begin;
create table public.drywash_admins (email text primary key);
alter table public.drywash_admins enable row level security;
revoke all on public.drywash_admins from anon, authenticated;
grant select on public.drywash_admins to authenticated;
create policy admin_self on public.drywash_admins for select to authenticated using (email = lower(auth.jwt()->>'email'));
create function public.drywash_is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(select 1 from public.drywash_admins where email=lower(auth.jwt()->>'email'));
$$;
revoke all on function public.drywash_is_admin() from public, anon;
grant execute on function public.drywash_is_admin() to authenticated;
create table public.drywash_plans (
 id uuid primary key,
 owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(),
 status text not null default 'aprovado' check (status in ('aprovado','execucao','encerrado')),
 plan jsonb not null check (jsonb_typeof(plan)='object' and octet_length(plan::text)<=200000 and length(plan->>'resp') between 1 and 120 and length(plan->>'loja') between 1 and 200),
 file_path text check (file_path is null or length(file_path)<300)
);
alter table public.drywash_plans enable row level security;
revoke all on public.drywash_plans from anon, authenticated;
grant select, insert on public.drywash_plans to authenticated;
grant update(status) on public.drywash_plans to authenticated;
create index drywash_plans_owner on public.drywash_plans(owner_id);
create policy plans_insert on public.drywash_plans for insert to authenticated with check (owner_id=auth.uid() and status='aprovado' and (file_path is null or split_part(file_path,'/',1)=auth.uid()::text));
create policy plans_read on public.drywash_plans for select to authenticated using(owner_id=auth.uid() or public.drywash_is_admin());
create policy plans_update on public.drywash_plans for update to authenticated using(public.drywash_is_admin()) with check(public.drywash_is_admin());
insert into storage.buckets(id,name,public,file_size_limit) values('drywash-lists','drywash-lists',false,5242880);
create policy drywash_files_insert on storage.objects for insert to authenticated with check(bucket_id='drywash-lists' and (storage.foldername(name))[1]=auth.uid()::text and lower(storage.extension(name)) in ('csv','txt'));
create policy drywash_files_read on storage.objects for select to authenticated using(bucket_id='drywash-lists' and ((storage.foldername(name))[1]=auth.uid()::text or public.drywash_is_admin()));
create policy drywash_files_delete on storage.objects for delete to authenticated using(bucket_id='drywash-lists' and (storage.foldername(name))[1]=auth.uid()::text);
commit;
