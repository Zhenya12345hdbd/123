<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'auth.php';

$me = requireAuth();

try {
    // 1. Начинаем транзакцию (чтобы если что-то упадет, база не сломалась)
    $pdo->beginTransaction();

    // 2. Находим все комнаты, где участвует пользователь
    $stmt = $pdo->prepare("SELECT id FROM rooms WHERE user1_id = ? OR user2_id = ?");
    $stmt->execute([$me, $me]);
    $rooms = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (!empty($rooms)) {
        // Превращаем массив [1, 2] в строку "1,2" для SQL
        $roomIds = implode(',', $rooms);

        // 3. Удаляем все сообщения из этих комнат
        $pdo->exec("DELETE FROM messages WHERE room_id IN ($roomIds)");

        // 4. Удаляем сами комнаты
        $pdo->exec("DELETE FROM rooms WHERE id IN ($roomIds)");
    }

    // 5. Удаляем пользователя из таблицы users
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$me]);

    // Фиксируем изменения
    $pdo->commit();

    // Уничтожаем сессию
    $_SESSION = [];
    session_destroy();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $pdo->rollBack(); // Откатываем всё, если была ошибка
    error_log("delete_account error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось удалить аккаунт']);
}