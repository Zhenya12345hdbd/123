<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

$data = json_decode(file_get_contents('php://input'), true);
$friendId = (int)($data['friend_id'] ?? 0);

if (!$friendId || $friendId === $me) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверные данные']);
    exit;
}

try {
    // 1. Получаем текущий список друзей
    $stmt = $pdo->prepare("SELECT friends FROM users WHERE id = ?");
    $stmt->execute([$me]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $friends = $row && $row['friends'] ? json_decode($row['friends'], true) : [];
    
    // 2. Проверяем, нет ли уже этого друга
    if (in_array($friendId, $friends)) {
        echo json_encode(['success' => true, 'message' => 'Уже в друзьях']);
        exit;
    }
    
    // 3. Добавляем и сохраняем
    $friends[] = $friendId;
    $stmt = $pdo->prepare("UPDATE users SET friends = ? WHERE id = ?");
    $stmt->execute([json_encode(array_values($friends)), $me]);
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    error_log("add_friend error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
}