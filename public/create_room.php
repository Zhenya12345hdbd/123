<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

$data = json_decode(file_get_contents('php://input'), true);
$user2 = (int)($data['user2_id'] ?? 0);

if (!$user2 || $user2 === $me) {
    http_response_code(400); echo json_encode(['error'=>'Неверные данные']); exit;
}

$min = min($me, $user2);
$max = max($me, $user2);

$stmt = $pdo->prepare("SELECT id FROM rooms WHERE user1_id = ? AND user2_id = ?");
$stmt->execute([$min, $max]);
$existing = $stmt->fetch();
if ($existing) { echo json_encode(['room_id'=>(int)$existing['id']]); exit; }

$stmt = $pdo->prepare("INSERT INTO rooms (user1_id, user2_id) VALUES (?, ?)");
$stmt->execute([$min, $max]);
echo json_encode(['room_id'=>(int)$pdo->lastInsertId()]);