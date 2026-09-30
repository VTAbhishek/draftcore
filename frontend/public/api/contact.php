<?php
/**
 * DraftCore enquiry handler.
 *
 * - Validates the enquiry form, rejects bots via honeypot + simple per-IP rate limit.
 * - Stores uploads in a private storage folder (outside dist/ so rebuilds never wipe them).
 * - Appends every enquiry to storage/enquiries.jsonl, then emails RECIPIENT via mail().
 *   Configure SMTP (php.ini / sendmail) on the host for mail() to deliver.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const RECIPIENT = 'info@draftcoresolutions.com';
const FROM_ADDRESS = 'no-reply@draftcoresolutions.com';
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXT = ['pdf', 'dwg', 'dxf', 'rvt', 'ifc', 'jpg', 'jpeg', 'png', 'zip'];
const RATE_LIMIT_SECONDS = 30;

// public/api or dist/api → project root /storage (outside the web build).
$storageDir = dirname(__DIR__, 2) . '/storage';

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body);
    exit;
}

function field(string $key, int $max = 2000): string
{
    $value = trim((string)($_POST[$key] ?? ''));
    return mb_substr($value, 0, $max);
}

function oneLine(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

function ensureDir(string $dir): void
{
    if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
        respond(500, ['ok' => false, 'error' => 'Server storage is not writable.']);
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

// Honeypot: pretend success so bots don't retry.
if (field('website') !== '') {
    respond(200, ['ok' => true]);
}

ensureDir($storageDir);
// Deny web access in case storage sits inside the document root (e.g. XAMPP htdocs).
if (!file_exists($storageDir . '/.htaccess')) {
    file_put_contents($storageDir . '/.htaccess', "Require all denied\nDeny from all\n");
}

// Rate limit per IP.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateDir = $storageDir . '/ratelimit';
ensureDir($rateDir);
$rateFile = $rateDir . '/' . hash('sha256', $ip);
if (is_file($rateFile) && (time() - (int)file_get_contents($rateFile)) < RATE_LIMIT_SECONDS) {
    respond(429, ['ok' => false, 'error' => 'Please wait a moment before sending another enquiry.']);
}

$data = [
    'name' => oneLine(field('name', 120)),
    'company' => oneLine(field('company', 160)),
    'jobTitle' => oneLine(field('jobTitle', 120)),
    'email' => oneLine(field('email', 200)),
    'phone' => oneLine(field('phone', 60)),
    'projectType' => oneLine(field('projectType', 60)),
    'service' => oneLine(field('service', 120)),
    'location' => oneLine(field('location', 160)),
    'startDate' => oneLine(field('startDate', 20)),
    'deliverables' => oneLine(field('deliverables', 400)),
    'fileLink' => oneLine(field('fileLink', 500)),
    'message' => field('message', 5000),
];

$errors = [];
if ($data['name'] === '') $errors[] = 'name';
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($data['service'] === '') $errors[] = 'service';
if (mb_strlen($data['message']) < 10) $errors[] = 'message';
if (field('consent') !== 'yes') $errors[] = 'consent';
if ($data['fileLink'] !== '' && !filter_var($data['fileLink'], FILTER_VALIDATE_URL)) $errors[] = 'fileLink';
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $errors]);
}

$id = date('Ymd-His') . '-' . bin2hex(random_bytes(3));
$saved = [];

if (!empty($_FILES['files']) && is_array($_FILES['files']['name'])) {
    $count = count($_FILES['files']['name']);
    if ($count > MAX_FILES) {
        respond(422, ['ok' => false, 'error' => 'Too many files attached.']);
    }
    $total = 0;
    $uploadDir = $storageDir . '/uploads/' . $id;
    for ($i = 0; $i < $count; $i++) {
        $err = $_FILES['files']['error'][$i];
        if ($err === UPLOAD_ERR_NO_FILE) continue;
        if ($err !== UPLOAD_ERR_OK) {
            respond(422, ['ok' => false, 'error' => 'A file failed to upload. Please try again or share a link.']);
        }
        $size = (int)$_FILES['files']['size'][$i];
        $total += $size;
        $original = basename((string)$_FILES['files']['name'][$i]);
        $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXT, true)) {
            respond(422, ['ok' => false, 'error' => "File type not accepted: {$original}"]);
        }
        if ($size > MAX_FILE_BYTES || $total > MAX_TOTAL_BYTES) {
            respond(422, ['ok' => false, 'error' => 'Attachments are too large. Please share a download link instead.']);
        }
        $tmp = $_FILES['files']['tmp_name'][$i];
        if (!is_uploaded_file($tmp)) {
            respond(400, ['ok' => false, 'error' => 'Invalid upload.']);
        }
        ensureDir($uploadDir);
        $safeName = sprintf('%02d-%s.%s', $i + 1, preg_replace('/[^A-Za-z0-9_-]+/', '_', pathinfo($original, PATHINFO_FILENAME)) ?: 'file', $ext);
        if (!move_uploaded_file($tmp, $uploadDir . '/' . $safeName)) {
            respond(500, ['ok' => false, 'error' => 'Could not store the uploaded file.']);
        }
        $saved[] = ['name' => $original, 'stored' => "uploads/{$id}/{$safeName}", 'bytes' => $size];
    }
}

$record = ['id' => $id, 'received' => date(DATE_ATOM), 'ip' => $ip] + $data + ['files' => $saved];
file_put_contents($storageDir . '/enquiries.jsonl', json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n", FILE_APPEND | LOCK_EX);
file_put_contents($rateFile, (string)time());

$labels = [
    'name' => 'Name', 'company' => 'Company', 'jobTitle' => 'Job title', 'email' => 'Email',
    'phone' => 'Phone / WhatsApp', 'projectType' => 'Project type', 'service' => 'Required service',
    'location' => 'Project location', 'startDate' => 'Expected start', 'deliverables' => 'Deliverables',
    'fileLink' => 'File link',
];
$body = "New project enquiry {$id}\n\n";
foreach ($labels as $key => $label) {
    $body .= str_pad($label . ':', 20) . ($data[$key] !== '' ? $data[$key] : '—') . "\n";
}
$body .= "\nMessage / scope:\n{$data['message']}\n";
if ($saved) {
    $body .= "\nAttachments (stored on server in storage/):\n";
    foreach ($saved as $f) {
        $body .= "- {$f['name']} → {$f['stored']} (" . round($f['bytes'] / 1024) . " KB)\n";
    }
}

$subject = '=?UTF-8?B?' . base64_encode('Project enquiry — ' . ($data['company'] ?: $data['name'])) . '?=';
$headers = implode("\r\n", [
    'From: DraftCore Website <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $data['name'] . ' <' . $data['email'] . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
]);
$mailed = @mail(RECIPIENT, $subject, $body, $headers);

respond(200, ['ok' => true, 'id' => $id, 'mailed' => $mailed]);
