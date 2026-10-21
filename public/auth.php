<?php
// auth.php — общая проверка сессии для HTTP-ручек
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function requireAuth(): int {
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Не авторизован']);
        exit;
    }
    return (int)$_SESSION['user_id'];
}