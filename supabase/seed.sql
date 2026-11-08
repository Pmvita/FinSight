-- Demo seed for FinSight (run after migrations). Uses a fixed demo user UUID.
-- For Supabase Auth, create the matching auth.users row first, or use demo mode in the app.

insert into public.categories (id, name, type) values
  ('11111111-1111-1111-1111-111111111101', 'SaaS Revenue', 'income'),
  ('11111111-1111-1111-1111-111111111102', 'Consulting', 'income'),
  ('11111111-1111-1111-1111-111111111201', 'Payroll', 'expense'),
  ('11111111-1111-1111-1111-111111111202', 'Marketing', 'expense'),
  ('11111111-1111-1111-1111-111111111203', 'Infrastructure', 'expense'),
  ('11111111-1111-1111-1111-111111111204', 'Office', 'expense')
on conflict (id) do nothing;
