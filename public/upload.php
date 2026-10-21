<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();   // 401, если нет сессии — curl без cookie отвалится

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Файл не загружен']);
    exit;
}

$file     = $_FILES['file'];
$origName = $file['name'];
$size     = (int)$file['size'];

if ($size <= 0) { http_response_code(400); echo json_encode(['error' => 'Пустой файл']); exit; }
if ($size > 100 * 1024 * 1024) { http_response_code(413); echo json_encode(['error' => 'Файл больше 100 МБ']); exit; }

$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
$allowedExt = ['jpg','jpeg','png','gif','webp','avif','bmp','mp4','webm','mov','avi','mkv','mp3','wav','ogg','m4a','pdf','txt','csv','doc','docx','xls','xlsx','ppt','pptx','zip','rar','7z','tar','gz'];
if ($ext === '' || !in_array($ext, $allowedExt, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Недопустимый тип файла']);
    exit;
}

$mime = mime_content_type($file['tmp_name']);
if (!$mime) { http_response_code(400); echo json_encode(['error' => 'Не удалось определить MIME']); exit; }

$type = 'files';
if (str_starts_with($mime, 'image/')) {
    if (!@getimagesize($file['tmp_name'])) { http_response_code(400); echo json_encode(['error' => 'Некорректное изображение']); exit; }
    $type = 'images';
} elseif (str_starts_with($mime, 'video/')) { $type = 'videos'; }
elseif (str_starts_with($mime, 'audio/')) { $type = 'audio'; }
elseif ($mime === 'application/pdf') { $type = 'documents'; }
elseif (preg_match('/\.(zip|rar|7z|tar|gz)$/i', $origName)) { $type = 'archives'; }
elseif (in_array($mime, ['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','text/csv'], true)) { $type = 'documents'; }

$safeName = bin2hex(random_bytes(8)) . '.' . $ext;
$baseDir = __DIR__ . '/uploads';
$targetDir = $baseDir . '/' . $type;

if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
    http_response_code(500); echo json_encode(['error' => 'Не удалось создать папку']); exit;
}

$targetPath = $targetDir . '/' . $safeName;
$webPath = '/uploads/' . $type . '/' . $safeName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500); echo json_encode(['error' => 'Не удалось сохранить файл']); exit;
}

// опционально: запись в files (если таблица есть)
try {
    $stmt = $pdo->prepare("INSERT INTO files (user_id, path, safe_name, orig_name, mime, size, created_at) VALUES (?,?,?,?,?,?,NOW())");
    $stmt->execute([$me, $webPath, $safeName, $origName, $mime, $size]);
} catch (Throwable $e) {
    error_log("files INSERT: " . $e->getMessage());
}

echo json_encode([
    'path' => $webPath, 'type' => $type, 'mime' => $mime,
    'name' => $origName, 'size' => $size, 'safe_name' => $safeName,
]);