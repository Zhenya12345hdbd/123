<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require 'db.php';
require 'auth.php';

$me = requireAuth();

try {
    // 1. Добавили r.user1_id AS creator_id в выборку
    $stmt = $pdo->prepare("
        SELECT 
            r.id, 
            r.group_name,
            r.user1_id AS creator_id,
            (SELECT COUNT(*) FROM room_members WHERE room_id = r.id) AS total_members,
            (SELECT GROUP_CONCAT(u.first_name, ' ', u.last_name SEPARATOR ', ') 
             FROM room_members rm2 
             JOIN users u ON rm2.user_id = u.id 
             WHERE rm2.room_id = r.id AND rm2.user_id != ?) AS members_names
        FROM rooms r
        JOIN room_members rm ON r.id = rm.room_id
        WHERE rm.user_id = ? AND r.is_group = 1
        ORDER BY r.id DESC
    ");
    $stmt->execute([$me, $me]);
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Запрос первых 4 аватарок участников
    $stmtAvatars = $pdo->prepare("
        SELECT u.avatar_path 
        FROM room_members rm
        JOIN users u ON rm.user_id = u.id
        WHERE rm.room_id = ?
        ORDER BY (u.avatar_path IS NOT NULL AND u.avatar_path != '') DESC
        LIMIT 4
    ");

    // 3. Передаём creator_id в итоговый JSON
    $result = array_map(function($g) use ($stmtAvatars) {
        $stmtAvatars->execute([$g['id']]);
        $avatars = $stmtAvatars->fetchAll(PDO::FETCH_COLUMN);

        return [
            'id' => (int)$g['id'],
            'name' => $g['group_name'],
            'creator_id' => (int)$g['creator_id'],
            'members_count' => (int)$g['total_members'],
            'members_names' => $g['members_names'],
            'member_avatars' => $avatars,
        ];
    }, $groups);

    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
