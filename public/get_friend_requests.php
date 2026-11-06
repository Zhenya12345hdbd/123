<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

try {
    $stmt = $pdo->prepare("
        SELECT fr.id AS request_id, fr.sender_id, u.first_name, u.last_name, u.avatar_path AS sender_avatar
        FROM friend_requests fr
        JOIN users u ON fr.sender_id = u.id
        WHERE fr.receiver_id = ? AND fr.status = 'pending'
    ");
    $stmt->execute([$me]);
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Форматируем под то, что ждет фронтенд
    $result = array_map(function($req) {
        return [
            'request_id' => (int)$req['request_id'],
            'sender_id' => (int)$req['sender_id'],
            'sender_name' => $req['first_name'] . ' ' . $req['last_name'],
            'sender_avatar' => $req['sender_avatar'],
            'type' => 'new_friend_request'
        ];
    }, $requests);

    echo json_encode($result);
} catch (Exception $e) {
    error_log("get_friend_requests error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
}