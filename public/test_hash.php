<?php
require 'db.php';

$stmt = $pdo->prepare("SELECT id, first_name, last_name, password FROM users WHERE first_name = ? AND last_name = ?");
$stmt->execute(['Иван', 'Сидоров']);
$u = $stmt->fetch();

if (!$u) {
    echo "Пользователь не найден\n";
    exit;
}

echo "id: {$u['id']}\n";
echo "hash: {$u['password']}\n";
echo "verify('123456'): " . (password_verify('123456', $u['password']) ? 'OK' : 'FAIL') . "\n";