<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // если фронт на другом origin — см. ниже

require 'db.php';
if (session_status() === PHP_SESSION_NONE) session_start();

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Введите имя и пароль']);
    exit;
}

$fullName = trim($input['username']);
$parts = preg_split('/\s+/', $fullName, 2); // имя + фамилия, без лишних пробелов
$first = $parts[0] ?? '';
$last  = $parts[1] ?? '';
$password = $input['password'];

if ($first === '' || $last === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Заполните все поля']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE first_name = ? AND last_name = ?");
    $stmt->execute([$first, $last]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // 1) сессия
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$user['id'];

        // 2) токен для WS
        $token = bin2hex(random_bytes(32));
        $upd = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
        $upd->execute([$token, $user['id']]);

        echo json_encode([
            'success'     => true,
            'id'          => (int)$user['id'],
            'first_name'  => $user['first_name'],
            'last_name'   => $user['last_name'],
            'avatar_path' => $user['avatar_path'],
            'token'       => $token,   // ← фронт сохранит в localStorage
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Неверное имя или пароль']);
    }
} catch (PDOException $e) {
    error_log("login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
}
?>
