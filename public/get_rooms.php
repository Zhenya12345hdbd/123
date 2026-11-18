<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

try {
    $stmt = $pdo->prepare("
        SELECT r.id, r.group_name,
               (SELECT GROUP_CONCAT(u.first_name, ' ', u.last_name SEPARATOR ', ') 
                FROM room_members rm2 
                JOIN users u ON rm2.user_id = u.id 
                WHERE rm2.room_id = r.id AND rm2.user_id != ?) AS members_names
        FROM rooms r
        JOIN room_members rm ON r.id = rm.room_id
        WHERE rm.user_id = ? AND r.is_group = 1
    ");
    $stmt->execute([$me, $me]);
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = array_map(function($g) {
        return [
            'id' => (int)$g['id'],
            'name' => $g['group_name'],
            'members_count' => $g['members_names'] ? count(explode(', ', $g['members_names'])) : 0,
        ];
    }, $groups);

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}