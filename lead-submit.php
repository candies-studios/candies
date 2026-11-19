<?php
/* ───────────────────────────────────────────────────────────────
   Candies Studio — lead endpoint for the landing-page form
   POST JSON  →  { ok: true, reference: "CS-1001" }  |  { ok: false, error }
   Stores the lead in MySQL, emails the team, (optionally) confirms to
   the visitor, sends Meta Conversions API "Lead" with the same event_id
   as the browser Pixel (so Meta counts it once), and an optional webhook.
   ─────────────────────────────────────────────────────────────── */
declare(strict_types=1);

$cfgFile = __DIR__ . '/config.php';
$CFG = is_file($cfgFile) ? require $cfgFile : null;

/* ── CORS ── */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $CFG['allowed_origins'] ?? [];
if ($origin && (in_array($origin, $allowed, true) || preg_match('#^http://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin))) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, apikey');
    header('Access-Control-Max-Age: 86400');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function out(int $code, array $body): never { http_response_code($code); echo json_encode($body, JSON_UNESCAPED_UNICODE); exit; }
function s($v, int $max): string { return is_string($v) ? mb_substr(trim($v), 0, $max) : ''; }
function h(string $v): string { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }

if (!$CFG) out(500, ['ok' => false, 'error' => 'Server is not configured yet (config.php missing).']);
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(405, ['ok' => false, 'error' => 'Method not allowed.']);
if ($origin && !in_array($origin, $allowed, true) && !preg_match('#^http://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin))
    out(403, ['ok' => false, 'error' => 'Origin not allowed.']);

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 64000) out(413, ['ok' => false, 'error' => 'Request too large.']);
$body = json_decode($raw, true);
if (!is_array($body)) out(400, ['ok' => false, 'error' => 'Invalid request.']);

/* ── Bot checks (silently accept so bots learn nothing) ── */
if (!empty($body['website'])) out(200, ['ok' => true, 'reference' => '']);
$startedAt = (int)($body['started_at'] ?? 0);
if ($startedAt && (microtime(true) * 1000 - $startedAt) < ($CFG['min_fill_seconds'] ?? 3) * 1000)
    out(400, ['ok' => false, 'error' => 'That was quick! Please review your details and submit again.']);

/* ── Validate ── */
$INTERESTS = ['website' => 'Websites', 'applications' => 'Applications', 'software' => 'Software'];
$L = is_array($body['lead'] ?? null) ? $body['lead'] : [];
$lead = [
    'name'      => s($L['name'] ?? '', 120),
    'email'     => strtolower(s($L['email'] ?? '', 200)),
    'phone'     => s($L['phone'] ?? '', 30),
    'country'   => s($L['country'] ?? '', 80),
    'interests' => array_values(array_unique(array_filter(is_array($L['interests'] ?? null) ? $L['interests'] : [], fn($i) => is_string($i) && isset($INTERESTS[$i])))),
    'message'   => s($L['message'] ?? '', 5000),
    'consent'   => ($L['consent'] ?? false) === true,
];
$err = [];
if (mb_strlen($lead['name']) < 2) $err['name'] = 'Please enter your full name.';
if (!filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) $err['email'] = 'Please enter a valid email.';
$digits = preg_replace('/\D/', '', $lead['phone']);
if (strlen($digits) < 7 || strlen($digits) > 15) $err['phone'] = 'Please enter a valid phone number.';
if ($lead['country'] === '') $err['country'] = 'Please choose your country.';
if (!$lead['interests']) $err['interests'] = 'Please choose at least one option.';
if (mb_strlen($lead['message']) < 15) $err['message'] = 'Please tell us a little more.';
if (!$lead['consent']) $err['consent'] = 'Please accept the privacy policy.';
if ($err) out(422, ['ok' => false, 'error' => reset($err), 'fields' => $err]);

$eventId  = preg_replace('/[^A-Za-z0-9_\-]/', '', s($body['event_id'] ?? '', 80)) ?: ('lead_' . bin2hex(random_bytes(6)));
$campaign = s($body['campaign'] ?? '', 80);
$pageUrl  = s($body['page_url'] ?? '', 1000);
$attr     = is_array($body['attribution'] ?? null) ? $body['attribution'] : [];
$last     = is_array($attr['last'] ?? null) ? $attr['last'] : [];
$first    = is_array($attr['first'] ?? null) ? $attr['first'] : [];
$ip       = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$ua       = s($_SERVER['HTTP_USER_AGENT'] ?? '', 400);
$ipHash   = hash('sha256', ($CFG['ip_salt'] ?? '') . $ip);

/* ── Turnstile (optional) ── */
if (!empty($CFG['turnstile_secret'])) {
    $r = post_form('https://challenges.cloudflare.com/turnstile/v0/siteverify', ['secret' => $CFG['turnstile_secret'], 'response' => s($body['turnstile_token'] ?? '', 4000), 'remoteip' => $ip]);
    if (!($r['json']['success'] ?? false)) out(400, ['ok' => false, 'error' => 'Security check failed — please try again.']);
}

/* ── Database ── */
try {
    $db = new PDO($CFG['db_dsn'], $CFG['db_user'] ?? null, $CFG['db_pass'] ?? null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
} catch (Throwable $e) {
    error_log('[candies-lead] DB connect: ' . $e->getMessage());
    out(500, ['ok' => false, 'error' => 'We could not save your enquiry. Please email us at ' . ($CFG['notify_to'] ?? 'sushil@candies.studio') . '.']);
}

// Same event submitted twice (double click / retry) → return the original reference
$dup = $db->prepare('SELECT reference FROM leads WHERE event_id = ?');
$dup->execute([$eventId]);
if ($row = $dup->fetch()) out(200, ['ok' => true, 'reference' => $row['reference']]);

// Rate limit per IP
$since = gmdate('Y-m-d H:i:s', time() - 60 * ($CFG['rate_limit_minutes'] ?? 10));
$rl = $db->prepare('SELECT COUNT(*) FROM leads WHERE ip_hash = ? AND created_at >= ?');
$rl->execute([$ipHash, $since]);
if ((int)$rl->fetchColumn() >= ($CFG['rate_limit_max'] ?? 5))
    out(429, ['ok' => false, 'error' => 'Too many enquiries from your network. Please try again in a few minutes or email us.']);

$ins = $db->prepare('INSERT INTO leads (created_at, name, email, phone, country, interests, message, campaign, landing_page_url, referrer,
  utm_source, utm_medium, utm_campaign, utm_content, utm_term, meta_campaign_id, meta_adset_id, meta_ad_id, fbclid, first_touch, last_touch,
  event_id, consent, tracking_consent, ip_hash, user_agent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
$ins->execute([
    gmdate('Y-m-d H:i:s'), $lead['name'], $lead['email'], $lead['phone'], $lead['country'], implode(',', $lead['interests']), $lead['message'],
    $campaign, $pageUrl, s($last['referrer'] ?? '', 1000),
    s($last['utm_source'] ?? '', 200), s($last['utm_medium'] ?? '', 200), s($last['utm_campaign'] ?? '', 200), s($last['utm_content'] ?? '', 200), s($last['utm_term'] ?? '', 200),
    s($last['campaign_id'] ?? '', 64), s($last['adset_id'] ?? '', 64), s($last['ad_id'] ?? '', 64), s($last['fbclid'] ?? '', 500),
    json_encode($first), json_encode($last), $eventId, 1, !empty($body['tracking_consent']) ? 1 : 0, $ipHash, $ua,
]);
$id = (int)$db->lastInsertId();
$reference = 'CS-' . (1000 + $id);
$db->prepare('UPDATE leads SET reference = ? WHERE id = ?')->execute([$reference, $id]);

$labels = implode(', ', array_map(fn($i) => $INTERESTS[$i], $lead['interests']));

/* ── Email the team ── */
$rows = [
    'Reference' => $reference, 'Name' => $lead['name'], 'Email' => $lead['email'], 'Phone' => $lead['phone'], 'Country' => $lead['country'],
    'Looking for' => $labels, 'Requirement' => $lead['message'], 'Campaign' => $campaign ?: '—',
    'Source' => trim(($last['utm_source'] ?? '') . ' / ' . ($last['utm_medium'] ?? ''), ' /') ?: 'Direct',
    'UTM campaign' => $last['utm_campaign'] ?? '—', 'Meta ad ID' => $last['ad_id'] ?? '—', 'Page' => $pageUrl ?: '—',
];
$html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#15161f"><h2 style="margin:0 0 12px">New enquiry ' . h($reference) . '</h2><table cellpadding="8" style="border-collapse:collapse">';
foreach ($rows as $k => $v) $html .= '<tr><td style="background:#f4f5f9;font-weight:bold;vertical-align:top;border:1px solid #e3e5ee">' . h($k) . '</td><td style="border:1px solid #e3e5ee">' . nl2br(h((string)$v)) . '</td></tr>';
$html .= '</table><p style="margin-top:16px"><a href="mailto:' . h($lead['email']) . '">Reply to ' . h($lead['name']) . '</a></p></div>';
$mailOk = send_mail($CFG, $CFG['notify_to'], "New lead $reference — {$lead['name']} ($labels)", $html, $lead['email'], $lead['name']);
$emailStatus = $mailOk ? 'sent' : 'failed';

if (!empty($CFG['send_confirmation'])) {
    $firstName = h(explode(' ', $lead['name'])[0]);
    $c = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#15161f"><p>Hi ' . $firstName . ',</p>'
       . '<p>Thank you for contacting Candies Studio. We have received your enquiry about <strong>' . h($labels) . '</strong> (reference <strong>' . h($reference) . '</strong>).</p>'
       . '<p>Our team will review your requirement and get back to you shortly.</p><p>Warm regards,<br>Team Candies Studio<br><a href="https://www.candies.studio">www.candies.studio</a></p></div>';
    send_mail($CFG, $lead['email'], "We've received your enquiry — $reference", $c, $CFG['notify_to'], 'Candies Studio');
}

/* ── Meta Conversions API ── */
$capiStatus = 'skipped';
if (!empty($CFG['meta_capi_token']) && !empty($CFG['meta_pixel_id'])) {
    $sha = fn(string $v) => hash('sha256', strtolower(trim($v)));
    $parts = preg_split('/\s+/', $lead['name']);
    $ud = ['em' => [$sha($lead['email'])], 'ph' => [$sha($digits)], 'fn' => [$sha($parts[0] ?? '')], 'client_ip_address' => $ip, 'client_user_agent' => $ua];
    if (count($parts) > 1) $ud['ln'] = [$sha(end($parts))];
    if (!empty($body['fbp'])) $ud['fbp'] = s($body['fbp'], 200);
    if (!empty($body['fbc'])) $ud['fbc'] = s($body['fbc'], 500);
    $payload = ['data' => [[
        'event_name' => 'Lead', 'event_time' => time(), 'event_id' => $eventId, 'action_source' => 'website',
        'event_source_url' => $pageUrl ?: null, 'user_data' => $ud,
        'custom_data' => ['content_name' => $campaign, 'content_category' => implode(',', $lead['interests']), 'lead_reference' => $reference],
    ]]];
    if (!empty($CFG['meta_test_event_code'])) $payload['test_event_code'] = $CFG['meta_test_event_code'];
    $r = post_json('https://graph.facebook.com/' . ($CFG['meta_api_version'] ?? 'v21.0') . '/' . $CFG['meta_pixel_id'] . '/events?access_token=' . urlencode($CFG['meta_capi_token']), $payload);
    $capiStatus = ($r['code'] >= 200 && $r['code'] < 300) ? 'sent' : 'failed:' . $r['code'];
    if ($capiStatus !== 'sent') error_log('[candies-lead] CAPI ' . $r['code'] . ' ' . substr($r['body'], 0, 300));
}

/* ── Optional webhook ── */
if (!empty($CFG['webhook_url'])) {
    post_json($CFG['webhook_url'], ['reference' => $reference, 'lead' => $lead, 'interests_label' => $labels, 'campaign' => $campaign, 'page_url' => $pageUrl, 'attribution' => $last, 'event_id' => $eventId]);
}

$db->prepare('UPDATE leads SET email_status = ?, capi_status = ? WHERE id = ?')->execute([$emailStatus, $capiStatus, $id]);
out(200, ['ok' => true, 'reference' => $reference]);

/* ── helpers ── */
function send_mail(array $CFG, string $to, string $subject, string $html, string $replyTo, string $replyName): bool {
    $from = $CFG['mail_from'] ?? 'no-reply@candies.studio';
    $fromName = $CFG['mail_from_name'] ?? 'Candies Studio';
    $enc = fn(string $v) => '=?UTF-8?B?' . base64_encode($v) . '?=';
    $headers = implode("\r\n", [
        'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8',
        'From: ' . $enc($fromName) . " <$from>",
        'Reply-To: ' . $enc($replyName) . ' <' . str_replace(["\r", "\n"], '', $replyTo) . '>',
    ]);
    if (!empty($CFG['mail_test_log'])) { file_put_contents($CFG['mail_test_log'], "TO:$to\nSUBJECT:$subject\n$headers\n\n$html\n-----\n", FILE_APPEND); return true; }
    return @mail($to, $enc($subject), $html, $headers, '-f' . $from);
}
function post_json(string $url, array $data): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($data), CURLOPT_HTTPHEADER => ['Content-Type: application/json'], CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8]);
    $b = (string)curl_exec($ch); $c = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    return ['code' => $c, 'body' => $b, 'json' => json_decode($b, true)];
}
function post_form(string $url, array $data): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => http_build_query($data), CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8]);
    $b = (string)curl_exec($ch); $c = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    return ['code' => $c, 'body' => $b, 'json' => json_decode($b, true)];
}
