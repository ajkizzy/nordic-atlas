-- ============================================================
-- Private storage bucket for client assets (mockups, contracts, PDFs)
-- Files are served exclusively via signed URLs — never public.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-assets',
  'client-assets',
  false,
  26214400, -- 25 MB
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/avif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- Only CRM roles (owner + sales) can read/write in the bucket.
create policy "client-assets: crm read"
  on storage.objects for select
  using (bucket_id = 'client-assets' and public.get_my_role() in ('owner', 'sales'));

create policy "client-assets: crm insert"
  on storage.objects for insert
  with check (bucket_id = 'client-assets' and public.get_my_role() in ('owner', 'sales'));

create policy "client-assets: crm delete"
  on storage.objects for delete
  using (bucket_id = 'client-assets' and public.get_my_role() in ('owner', 'sales'));
