-- Single-step enquiry form (19 Nov 2026): company is no longer collected.
-- Run this in Supabase SQL Editor if you already created the leads table.
alter table public.leads alter column company drop not null;
