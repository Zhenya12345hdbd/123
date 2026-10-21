<?php
session_start();
require 'db.php';

if (!empty($_SESSION['user_id'])) {
    $stmt = $pdo->prepare("UPDATE users SET token = NULL WHERE id = ?");
    $stmt->execute([(int)$_SESSION['user_id']]);
}

$_SESSION = [];
session_destroy();
header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>