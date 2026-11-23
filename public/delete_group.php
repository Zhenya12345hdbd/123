<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';
require 'auth.php';

$me = requireAuth();

$data = json_decode(file_get_contents('php://input'), true);
$roomId = (int)($data['room_id'] ?? 0);

if (!$roomId) {
    http_response_code(400);
    echo json_encode(['error' => 'Не указан ID группы'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // 1. Проверяем, существует ли группа и кто её создатель (user1_id)
    $stmt = $pdo->prepare("SELECT user1_id FROM rooms WHERE id = ? AND is_group = 1");
    $stmt->execute([$roomId]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) {
        http_response_code(404);
        echo json_encode(['error' => 'Группа не найдена'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ((int)$room['user1_id'] !== (int)$me) {
        http_response_code(403);
        echo json_encode(['error' => 'Только создатель может удалить эту группу'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2. Удаляем всё, что связано с группой, внутри транзакции
    $pdo->beginTransaction();

    $pdo->prepare("DELETE FROM messages WHERE room_id = ?")->execute([$roomId]);
    $pdo->prepare("DELETE FROM room_members WHERE room_id = ?")->execute([$roomId]);
    $pdo->prepare("DELETE FROM rooms WHERE id = ?")->execute([$roomId]);

    $pdo->commit();

    echo json_encode(['success' => true, 'room_id' => $roomId], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при удалении группы: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
