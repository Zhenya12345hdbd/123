<?php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

$room_id  = (int)($_GET['room_id'] ?? 0);
$user_id  = (int)($_GET['user_id'] ?? 0);
$limit    = (int)($_GET['limit'] ?? 10);
$beforeId = isset($_GET['before_id']) && $_GET['before_id'] !== ''
    ? (int)$_GET['before_id']
    : null;

if (!$room_id) {
    echo json_encode(['messages' => [], 'has_more' => false]);
    exit;
}

if ($limit < 1 || $limit > 50) $limit = 10;

try {
    // Проверка доступа: пользователь должен быть участником комнаты
    if ($user_id > 0) {
        $stmt = $pdo->prepare("SELECT user1_id, user2_id FROM rooms WHERE id = ?");
        $stmt->execute([$room_id]);
        $room = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$room) {
            http_response_code(404);
            echo json_encode(['error' => 'Комната не найдена']);
            exit;
        }
        if ($user_id !== (int)$room['user1_id'] && $user_id !== (int)$room['user2_id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Нет доступа к комнате']);
            exit;
        }
    }

    // Берём на 1 больше, чтобы понять, есть ли ещё
    $fetchLimit = $limit + 1;

    $sql = "
        SELECT m.id, m.text, m.created_at, m.user_id AS from_user_id,
               m.room_id, m.is_read, m.file_paths,
               u.first_name, u.last_name, u.avatar_path
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.room_id = :room_id
    ";
    if ($beforeId !== null) {
        $sql .= " AND m.id < :before_id ";
    }
    $sql .= " ORDER BY m.id DESC LIMIT :limit ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':room_id', $room_id, PDO::PARAM_INT);
    if ($beforeId !== null) {
        $stmt->bindValue(':before_id', $beforeId, PDO::PARAM_INT);
    }
    $stmt->bindValue(':limit', $fetchLimit, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $has_more = count($rows) > $limit;
    if ($has_more) {
        // отрезаем лишнюю (самую старую) запись
        array_pop($rows);
    }

    // Разворачиваем в хронологический порядок (старые → новые)
    $rows = array_reverse($rows);

    $result = array_map(function ($row) {
        $filePaths = null;
        if ($row['file_paths']) {
            $decoded = json_decode($row['file_paths'], true);
            if (is_array($decoded)) $filePaths = $decoded;
        }

        $type = 'message';
        if (!empty($filePaths)) $type = 'file_batch_with_text';

        $time = $row['created_at']
            ? date('H:i', strtotime($row['created_at']))
            : '00:00';

        $username = trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? ''));
        if (!$username) $username = 'Пользователь';

        return [
            'id'          => (int)$row['id'],
            'text'        => $row['text'] ?? '',
            'type'        => $type,
            'from'        => (int)$row['from_user_id'],
            'room_id'     => (int)$row['room_id'],
            'is_read'     => (int)$row['is_read'],
            'username'    => $username,
            'avatar_path' => $row['avatar_path'],
            'time'        => $time,
            'file_paths'  => $filePaths,
        ];
    }, $rows);

    echo json_encode([
        'messages' => $result,
        'has_more' => $has_more,
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    error_log('get_history error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}