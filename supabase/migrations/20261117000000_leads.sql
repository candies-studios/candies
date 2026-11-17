-- ─────────────────────────────────────────────────────────────
--  Candies Studio — lead storage
--  Run in Supabase: SQL Editor → paste → Run (or `supabase db push`).
-- ─────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

do $$ begin
  create type public.lead_status as enum ('new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost');
exception when duplicate_object then null; end $$;

create sequence if not exists public.lead_reference_seq start 1001;

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  reference        text unique not null default ('CS-' || nextval('public.lead_reference_seq')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  status           public.lead_status not null default 'new',

  -- contact
  name             text not null,
  email            text not null,
  phone            text not null,
  country          text not null,
  company          text not null,
  designation      text,

  -- requirement
  interests        text[] not null default '{}',
  message          text not null,
  budget           text,
  timeline         text,

  -- attribution
  campaign         text,                 -- landing page variant (master, websites, events …)
  landing_page_url text,
  referrer         text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_content      text,
  utm_term         text,
  meta_campaign_id text,
  meta_adset_id    text,
  meta_ad_id       text,
  fbclid           text,
  first_touch      jsonb,                -- full first-touch attribution snapshot
  last_touch       jsonb,                -- full last-touch attribution snapshot

  -- tracking & compliance
  event_id         text unique,          -- shared with Meta Pixel + Conversions API for deduplication
  consent          boolean not null default false,
  tracking_consent boolean not null default false,
  capi_status      text,                 -- sent | skipped | failed:<code>
  email_status     text,                 -- sent | skipped | failed:<code>
  ip_hash          text,                 -- salted hash, used only for rate limiting
  user_agent       text,

  -- sales follow-up (for your team / CRM)
  owner            text,
  notes            text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_email_idx      on public.leads (lower(email));
create index if not exists leads_ip_hash_idx    on public.leads (ip_hash, created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

-- Security: RLS on, and NO policies for anon/authenticated.
-- The public website can never read or write this table directly;
-- only the lead-submit Edge Function (service role) inserts rows.
alter table public.leads enable row level security;

-- Handy view for the team dashboard (Supabase Table Editor / Metabase / CRM sync)
create or replace view public.leads_overview with (security_invoker = true) as
select reference, created_at, status, name, company, designation, email, phone, country,
       array_to_string(interests, ', ') as interests, budget, timeline, campaign,
       utm_source, utm_medium, utm_campaign, utm_content, meta_ad_id, owner
from public.leads
order by created_at desc;
