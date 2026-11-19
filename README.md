# Candies Studio — lead backend for GoDaddy (PHP + MySQL)

The landing-page form sends each enquiry here. This script saves it in your
MySQL database, emails your team, sends the visitor a confirmation, and (optionally)
sends the "Lead" to Meta's Conversions API.

## 1. Create the database (cPanel)
1. cPanel → **MySQL® Databases** → create a database (e.g. `candies_leads`).
2. Create a user with a strong password and **add it to the database with ALL PRIVILEGES**.
3. cPanel → **phpMyAdmin** → open the database → **SQL** tab → paste `schema.sql` → **Go**.

## 2. Upload the files
1. cPanel → **File Manager** → in the folder for your backend domain, create a folder `leads`.
   (Recommended: a subdomain such as `api.candies.studio`. Create it under cPanel → Domains,
   and add a DNS **A record** `api` → your GoDaddy hosting IP. Your main `www` site stays on GitHub.)
2. Upload `lead-submit.php` and `.htaccess` into `leads/`.
3. Copy `config.sample.php` → `config.php` in the same folder and fill in:
   database name/user/password, `notify_to`, `mail_from` (an email on your domain),
   `ip_salt` (any long random text), and optionally `meta_capi_token`.

Your endpoint is now e.g. `https://api.candies.studio/leads/lead-submit.php`

## 3. Connect the website (GitHub)
Repo → Settings → Secrets and variables → Actions → **Variables**:
- `LEAD_ENDPOINT` = your endpoint URL from step 2
- `SUPABASE_ANON_KEY` = delete it / leave empty
- `FORM_ENDPOINT` = can be left as backup (only used if LEAD_ENDPOINT is empty)

Then Actions → re-run the deploy (or push any change).

## 4. Test
Submit the form on https://www.candies.studio/lp/ — you should land on the thank-you
page, get the email, and see the row in phpMyAdmin (`leads` table).
Meta: put a code in `meta_test_event_code`, check Events Manager → Test events, then clear it.

## Notes
- Allowed websites: `allowed_origins` in config.php. Add any other domain you use.
- Spam protection: hidden honeypot field, minimum fill time, 5 enquiries / 10 min per IP.
- Lead status column (`new`, `contacted`, `qualified`, `proposal_sent`, `converted`, `lost`)
  can be updated in phpMyAdmin for follow-up.
- If emails don't arrive, check spam, and make sure `mail_from` uses your own domain.
