-- Run in Supabase SQL editor. Then create an admin user in Authentication > Users
-- using the SAME email as below (change it if you use another).
create table requests(
 id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
 status text not null default 'New Enquiry' check (status in ('New Enquiry','Contacted','Discussion','Quotation Sent','In Progress','Completed','Cancelled')),
 category text, package text default 'starter', pricing_breakdown jsonb default '{}', purpose text, design text, pages text[], features text[],
 name text, business text, email text, whatsapp text, description text,
 reference_url text, budget text, timeline text, files jsonb default '[]', notes text default '');
create table enquiries(id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), name text, email text, message text);
create table portfolio_projects(id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), title text, category text, description text, tech text[], demo_url text, image_url text);
create table pricing_config(id text primary key default 'active', config jsonb, updated_at timestamptz default now());
alter table requests enable row level security; alter table enquiries enable row level security; alter table portfolio_projects enable row level security; alter table pricing_config enable row level security;
create function is_admin() returns boolean language sql stable as $$ select coalesce(auth.jwt()->>'email','')='pavitrash789@gmail.com' $$;
create policy "admin all" on requests for all using (is_admin()) with check (is_admin());
create policy "admin read" on enquiries for select using (is_admin());
create policy "public read" on portfolio_projects for select using (true);
create policy "admin write" on portfolio_projects for all using (is_admin()) with check (is_admin());
create policy "public read pricing" on pricing_config for select using (true);
create policy "admin write pricing" on pricing_config for all using (is_admin()) with check (is_admin());
insert into storage.buckets(id,name,public) values('uploads','uploads',false) on conflict do nothing;
create policy "admin read files" on storage.objects for select using (bucket_id='uploads' and is_admin());
-- Public inserts go through /api routes with the service role key, so no public insert policies exist.
