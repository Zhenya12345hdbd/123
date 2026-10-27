<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

$search = trim($_GET['search'] ?? '');

try {
    if ($search !== '') {
        $sql = "SELECT id, first_name, last_name, avatar_path 
                FROM users 
                WHERE first_name LIKE ? OR last_name LIKE ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["%$search%", "%$search%"]);
    } else {
        $stmt = $pdo->query("SELECT id, first_name, last_name, avatar_path FROM users");
    }
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (Exception $e) {
    error_log("get_users error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера']);
}
