<?php
if (session_status() === PHP_SESSION_NONE) session_start();

header('Content-Type: application/json');
require 'db.php';

$uploadDir = 'uploads/avatars/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не разрешён']);
    exit;
}

// 1. Проверка полей
$firstName = trim($_POST['firstName'] ?? '');
$lastName  = trim($_POST['lastName'] ?? '');
$password  = $_POST['password'] ?? '';

if ($firstName === '' || $lastName === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Заполните все поля']);
    exit;
}

// 2. Проверка капчи (ДО загрузки файла!)
$captchaInput = trim($_POST['captcha'] ?? '');
$captchaCode  = $_SESSION['captcha_code'] ?? '';
$captchaTime  = $_SESSION['captcha_time'] ?? 0;

unset($_SESSION['captcha_code'], $_SESSION['captcha_time']);

if ($captchaCode === '' || $captchaTime === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Капча не найдена. Обновите страницу.']);
    exit;
}

if (time() - $captchaTime > 600) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Капча устарела. Обновите страницу.']);
    exit;
}

if (strtolower($captchaInput) !== $captchaCode) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Неверный код капчи.']);
    exit;
}

// 3. Загрузка аватара
$avatarPath = null;

if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['avatar'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/avif', 'image/webp'];

    if (!in_array($file['type'], $allowedTypes, true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Только JPG, PNG, AVIF, WEBP']);
        exit;
    }

    // расширение по MIME, а не по имени файла (защита от .php.jpg)
    $extMap = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/avif' => 'avif',
        'image/webp' => 'webp',
    ];
    $extension = $extMap[$file['type']] ?? 'jpg';

    $newFileName = 'user_' . time() . '_' . random_int(100, 999) . '.' . $extension;
    $targetPath  = $uploadDir . $newFileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $avatarPath = '/' . $targetPath;
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Не удалось сохранить файл']);
        exit;
    }
}

// 4. INSERT
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, password, avatar_path) VALUES (?, ?, ?, ?)");
    $stmt->execute([$firstName, $lastName, $hashedPassword, $avatarPath]);

    $userId = (int)$pdo->lastInsertId();

    echo json_encode([
        'success'     => true,
        'id'          => $userId,
        'first_name'  => $firstName,
        'last_name'   => $lastName,
        'avatar_path' => $avatarPath,
    ]);
} catch (PDOException $e) {
    error_log("register: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка БД']);
}