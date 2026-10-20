<?php
header('Content-Type: application/json');
require 'db.php';

$user_id = (int)($_GET['user_id'] ?? 0);

if (!$user_id) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT from_user_id, COUNT(*) AS unread_count
        FROM (
            SELECT
                CASE
                    WHEN r.user1_id = ? THEN r.user2_id
                    ELSE r.user1_id
                END AS from_user_id
            FROM messages m
            JOIN rooms r ON m.room_id = r.id
            WHERE (r.user1_id = ? OR r.user2_id = ?)
              AND m.user_id != ?
              AND m.is_read = 0
        ) t
        GROUP BY from_user_id
    ");
    $stmt->execute([$user_id, $user_id, $user_id, $user_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    foreach ($rows as $row) {
        $result[(int)$row['from_user_id']] = (int)$row['unread_count'];
    }

    echo json_encode($result);
} catch (Exception $e) {
    error_log("Ошибка get_unread_counts: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}