<?php
// auth.php — общая проверка сессии для HTTP-ручек

// Устанавливаем время жизни сессии: 30 дней (60 * 60 * 24 * 30 = 2592000 сек)
/* $sessionLifetime = 2592000;

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.gc_maxlifetime', $sessionLifetime);
    ini_set('session.cookie_lifetime', $sessionLifetime);
    
    session_set_cookie_params([
        'lifetime' => $sessionLifetime,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    
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
} */
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