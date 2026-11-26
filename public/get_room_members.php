<?php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';
require 'auth.php';

$me = requireAuth();
$roomId = (int)($_GET['room_id'] ?? 0);

if (!$roomId) {
    http_response_code(400);
    echo json_encode(['error' => 'Не указан room_id'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // 1. Проверяем, что текущий пользователь сам состоит в этой группе
    $stmtCheck = $pdo->prepare("SELECT 1 FROM room_members WHERE room_id = ? AND user_id = ?");
    $stmtCheck->execute([$roomId, $me]);
    if (!$stmtCheck->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Нет доступа к списку участников этой группы'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2. Получаем всех участников группы
    // Сортируем так, чтобы создатель (r.user1_id) и вы были в начале списка
    $stmt = $pdo->prepare("
        SELECT 
            u.id, 
            u.first_name, 
            u.last_name, 
            u.avatar_path
        FROM room_members rm
        JOIN users u ON rm.user_id = u.id
        JOIN rooms r ON rm.room_id = r.id
        WHERE rm.room_id = ?
        ORDER BY (u.id = r.user1_id) DESC, u.first_name ASC
    ");
    $stmt->execute([$roomId]);
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Приводим id к числу для корректного сравнения в React
    foreach ($members as &$m) {
        $m['id'] = (int)$m['id'];
    }
    unset($m);

    echo json_encode($members, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
