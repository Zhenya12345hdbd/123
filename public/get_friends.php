<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

try {
    $stmt = $pdo->prepare("SELECT friends FROM users WHERE id = ?");
    $stmt->execute([$me]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $friendIds = $row && $row['friends'] ? json_decode($row['friends'], true) : [];
    
    if (empty($friendIds) || !is_array($friendIds)) {
        echo json_encode([]);
        exit;
    }

    // ВАЖНО: приводим все ID к числу, чтобы PDO не отправлял их как строки
    $friendIds = array_map('intval', $friendIds); 

    $inQuery = implode(',', array_fill(0, count($friendIds), '?'));
    $stmt = $pdo->prepare("SELECT id, first_name, last_name, avatar_path FROM users WHERE id IN ($inQuery)");
    $stmt->execute($friendIds);
    
    $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($friends);

} catch (Exception $e) {
    error_log("get_friends error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
}