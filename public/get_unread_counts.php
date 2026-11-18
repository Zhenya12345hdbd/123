<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

try {
    // 1. Непрочитанные в личных чатах
    $stmt = $pdo->prepare("
        SELECT from_user_id, COUNT(*) AS unread_count
        FROM (
            SELECT CASE WHEN r.user1_id = ? THEN r.user2_id ELSE r.user1_id END AS from_user_id
            FROM messages m JOIN rooms r ON m.room_id = r.id
            WHERE r.is_group = 0 AND (r.user1_id = ? OR r.user2_id = ?) AND m.user_id != ? AND m.is_read = 0
        ) t
        GROUP BY from_user_id
    ");
    $stmt->execute([$me, $me, $me, $me]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $result = [];
    foreach ($rows as $r) {
        $result[(string)$r['from_user_id']] = (int)$r['unread_count'];
    }

    // 2. Непрочитанные в группах (индивидуально для $me через message_reads)
    $stmtGroups = $pdo->prepare("
        SELECT m.room_id, COUNT(m.id) AS unread_count
        FROM messages m
        JOIN rooms r ON m.room_id = r.id
        JOIN room_members rm ON r.id = rm.room_id AND rm.user_id = ?
        LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = ?
        WHERE r.is_group = 1 AND m.user_id != ? AND mr.message_id IS NULL
        GROUP BY m.room_id
    ");
    $stmtGroups->execute([$me, $me, $me]);
    $groupRows = $stmtGroups->fetchAll(PDO::FETCH_ASSOC);

    foreach ($groupRows as $gr) {
        $result['group_' . $gr['room_id']] = (int)$gr['unread_count'];
    }

    echo json_encode($result);
} catch (Exception $e) {
    error_log("get_unread_counts: ".$e->getMessage());
    http_response_code(500); echo json_encode(['error'=>$e->getMessage()]);
}