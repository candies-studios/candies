<?php
/* ───────────────────────────────────────────────────────────────
   Candies Studio — lead backend settings
   1. Copy this file to  config.php  (same folder) and fill it in.
   2. Never put config.php on GitHub — it holds passwords.
   ─────────────────────────────────────────────────────────────── */
return [
    // MySQL database (cPanel → MySQL® Databases)
    'db_dsn'  => 'mysql:host=localhost;dbname=CHANGE_ME_dbname;charset=utf8mb4',
    'db_user' => 'CHANGE_ME_dbuser',
    'db_pass' => 'CHANGE_ME_password',

    // Websites allowed to send enquiries here
    'allowed_origins' => ['https://www.candies.studio', 'https://candies.studio'],

    // Email notifications (use an address on your own domain as the sender)
    'notify_to'     => 'sushil@candies.studio',          // who receives new leads (comma-separate for several)
    'mail_from'     => 'leads@candies.studio',           // must be a mailbox/domain hosted on GoDaddy
    'mail_from_name'=> 'Candies Studio Leads',
    'send_confirmation' => true,                         // send the visitor a "we got your enquiry" email

    // Meta Conversions API (optional — leave token empty to skip)
    'meta_pixel_id'        => '1403850081450847',
    'meta_capi_token'      => '',                        // Events Manager → Settings → Conversions API → Generate access token
    'meta_test_event_code' => '',                        // e.g. TEST12345 while testing, then empty
    'meta_api_version'     => 'v21.0',

    // Cloudflare Turnstile (optional — only if you set TURNSTILE_SITE_KEY on GitHub)
    'turnstile_secret' => '',

    // Spam protection
    'rate_limit_max'     => 5,     // max enquiries per IP …
    'rate_limit_minutes' => 10,    // … in this many minutes
    'min_fill_seconds'   => 3,     // submissions faster than this are treated as bots
    'ip_salt'            => 'CHANGE_ME_any_long_random_text',

    // Optional: also POST every lead as JSON to a CRM / Zapier / Make webhook
    'webhook_url' => '',
];
