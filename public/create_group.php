<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

$rawInput = file_get_contents('php://input');
error_log("RAW INPUT: " . $rawInput); // Смотрим, что пришло

$data = json_decode($rawInput, true);

$groupName = trim($data['name'] ?? '');
$memberIds = $data['members'] ?? [];

// Приводим все ID к числам (на случай, если пришли строки)
$memberIds = array_map('intval', $memberIds);

error_log("groupName: $groupName, members: " . print_r($memberIds, true)); // Смотрим, что распарсилось

if ($groupName === '' || empty($memberIds)) {
    http_response_code(400);
    echo json_encode(['error' => 'Введите название и выберите участников']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Создаем комнату
    $stmt = $pdo->prepare("INSERT INTO rooms (user1_id, user2_id, is_group, group_name) VALUES (?, 0, 1, ?)");
$stmt->execute([$me, $groupName]);
    $roomId = (int)$pdo->lastInsertId();

    // 2. Добавляем участников
    $allMembers = array_unique(array_merge([$me], $memberIds));
    
    $stmt = $pdo->prepare("INSERT INTO room_members (room_id, user_id) VALUES (?, ?)");
    foreach ($allMembers as $userId) {
        $stmt->execute([$roomId, $userId]);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'room_id' => $roomId]);

} catch (Exception $e) {
    $pdo->rollBack();
    error_log("create_group error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}