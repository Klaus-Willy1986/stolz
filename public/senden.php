<?php
// Kontaktformular: prüft die Eingaben und schickt sie per Mail an Claudia.
const EMPFAENGER = 'claudi@stolz-stoffundholz.de';
const ABSENDER   = 'formular@stolz-stoffundholz.de';

function ende(int $code, string $text): void {
    http_response_code($code);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<title>Kontakt</title><body style="font-family:system-ui;max-width:36rem;margin:3rem auto;padding:0 1.25rem">'
       . '<p>' . htmlspecialchars($text, ENT_QUOTES, 'UTF-8') . '</p><p><a href="/kontakt/">Zurück zum Formular</a></p></body>';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: /kontakt/'); exit; }

// Honeypot: echte Besucher lassen dieses Feld leer
if (!empty($_POST['website'] ?? '')) { header('Location: /danke/', true, 303); exit; }

$name  = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$text  = trim((string)($_POST['nachricht'] ?? ''));

if ($name === '' || $text === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ende(400, 'Bitte fülle alle Felder aus und gib eine gültige E-Mail-Adresse an.');
}
if (mb_strlen($name) > 100 || mb_strlen($email) > 150 || mb_strlen($text) > 4000) {
    ende(400, 'Deine Eingabe ist zu lang.');
}
// Zeilenumbrüche in Kopfzeilen verbieten (Header-Injection)
if (preg_match('/[\r\n]/', $name . $email)) { ende(400, 'Ungültige Eingabe.'); }

$betreff = 'Anfrage über die Website von ' . $name;
$inhalt  = "Name: $name\nE-Mail: $email\n\n$text\n";
$kopf = [
    'From' => ABSENDER,
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=utf-8',
];
$ok = mail(EMPFAENGER, '=?UTF-8?B?' . base64_encode($betreff) . '?=', $inhalt, $kopf);

if (!$ok) { ende(500, 'Das hat leider nicht geklappt. Bitte schreib mir direkt per E-Mail.'); }
header('Location: /danke/', true, 303);
