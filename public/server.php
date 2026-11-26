<?php
require 'vendor/autoload.php';
require 'db.php';


use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $pdo;
    protected $users;

    public function __construct($pdo) {
        $this->clients = new \SplObjectStorage;
        $this->pdo = $pdo;
        $this->users = [];
    }

    function onOpen(ConnectionInterface $conn) {
        $conn->user_id = null;
        $conn->username = 'Гость';
        $conn->avatar_path = null;

        $this->clients->attach($conn);
        echo "Новое подключение: {$conn->resourceId}\n";
        $this->sendOnlineList($conn);
    }

    function onMessage(ConnectionInterface $from, $msg) {
        if (empty($msg)) return;
        $data = json_decode($msg, true);

        error_log("RAW MSG: " . $msg);
        echo "ПОЛУЧЕНО СООБЩЕНИЕ: " . ($data['type'] ?? 'НЕТ ТИПА') . "\n";

        if (!$data) {
            error_log("JSON PARSE FAILED: " . $msg);
            return;
        }

        // --- Авторизация ---
        if (($data['type'] ?? '') === 'auth') {
            error_log("WS AUTH TOKEN: " . ($data['token'] ?? 'ПУСТО'));
    $token = trim($data['token'] ?? '');
    if ($token === '') { $from->close(); return; }

    $stmt = $this->pdo->prepare("SELECT id, first_name, last_name, avatar_path FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) { $from->close(); return; }

    $from->user_id     = (int)$user['id'];
    $from->username    = $user['first_name'].' '.$user['last_name'];
    $from->avatar_path = $user['avatar_path'];
    $this->users[$from->user_id] = $from;

    $from->send(json_encode(['type'=>'auth_ok','username'=>$from->username]));
    $this->broadcastStatus($from->user_id, true, $from);
    return;
}
if (($data['type'] ?? '') === 'send_request') {
    $targetId = (int)($data['target_id'] ?? 0);
    if (!$targetId || $targetId === $from->user_id) return;

    try {
        // 1. Ищем ЛЮБУЮ заявку между этими пользователями (без фильтра по статусу)
        $stmt = $this->pdo->prepare("SELECT id, status FROM friend_requests WHERE sender_id = ? AND receiver_id = ?");
        $stmt->execute([$from->user_id, $targetId]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            $requestId = (int)$existing['id'];
            
            // Если заявка уже была (например, отклонена), возвращаем её в статус pending
            if ($existing['status'] !== 'pending') {
                $this->pdo->prepare("UPDATE friend_requests SET status = 'pending', created_at = NOW() WHERE id = ?")->execute([$requestId]);
                echo "Обновлен статус старой заявки (ID: $requestId) на pending\n";
            } else {
                echo "Заявка уже существует (ID: $requestId). Отправляем уведомление повторно.\n";
            }
        } else {
            // 2. Если заявки вообще нет — создаем новую
            $stmt = $this->pdo->prepare("INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)");
            $stmt->execute([$from->user_id, $targetId]);
            $requestId = (int)$this->pdo->lastInsertId();
            echo "Создана новая заявка (ID: $requestId)\n";
        }

        // 3. Отправляем уведомление получателю
        if (isset($this->users[$targetId])) {
            $this->users[$targetId]->send(json_encode([
                'type' => 'new_friend_request',
                'sender_id' => $from->user_id,
                'sender_name' => $from->username,
                'sender_avatar' => $from->avatar_path,
                'request_id' => $requestId,
            ]));
            echo "Уведомление отправлено пользователю $targetId\n";
        }
    } catch (Exception $e) {
        error_log("Friend request error: " . $e->getMessage());
        echo "ОШИБКА ПРИ СОЗДАНИИ ЗАЯВКИ: " . $e->getMessage() . "\n";
    }
    return;
}
if (($data['type'] ?? '') === 'forward_message') {
    $targetId = (int)($data['target_user_id'] ?? 0);
    $isGroup  = (bool)($data['is_group'] ?? false);
    $original = $data['original_message'] ?? null;
    $me       = (int)$from->user_id;

    if (!$targetId || !$original || !$me) return;

    try {
        $roomId   = 0;
        $toUserId = 0;

        // 1. Определяем комнату (группа или личный чат)
        if ($isGroup) {
            $roomId = $targetId;

            // Проверяем, что отправитель состоит в группе
            $stmtCheck = $this->pdo->prepare("SELECT 1 FROM room_members WHERE room_id = ? AND user_id = ?");
            $stmtCheck->execute([$roomId, $me]);
            if (!$stmtCheck->fetch()) {
                echo "ОШИБКА: Пользователь $me не состоит в группе $roomId\n";
                return;
            }
        } else {
            $toUserId = $targetId;
            $min = min($me, $targetId);
            $max = max($me, $targetId);

            $stmt = $this->pdo->prepare("SELECT id FROM rooms WHERE user1_id = ? AND user2_id = ? AND is_group = 0");
            $stmt->execute([$min, $max]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$room) {
                $stmt = $this->pdo->prepare("INSERT INTO rooms (user1_id, user2_id, is_group) VALUES (?, ?, 0)");
                $stmt->execute([$min, $max]);
                $roomId = (int)$this->pdo->lastInsertId();
            } else {
                $roomId = (int)$room['id'];
            }
        }

        // 2. Готовим данные оригинального сообщения
        $text = $original['text'] ?? null;
        $rawFiles = $original['file_paths'] ?? $original['image_paths'] ?? null;
        $filePaths = !empty($rawFiles) ? json_encode($rawFiles) : null;
        $originalSenderId = (int)($original['from'] ?? $me);

        // Получаем имя и фамилию автора оригинала
        $stmt = $this->pdo->prepare("SELECT first_name, last_name FROM users WHERE id = ?");
        $stmt->execute([$originalSenderId]);
        $originalUser = $stmt->fetch(PDO::FETCH_ASSOC);
        $originalSenderFirstName = $originalUser ? $originalUser['first_name'] : 'Пользователь';
        $originalSenderLastName  = $originalUser ? $originalUser['last_name'] : '';

        // Время оригинала
        $originalTimeStr = $original['time'] ?? null;
        if ($originalTimeStr && strlen($originalTimeStr) <= 5) {
            $originalTime = date('Y-m-d') . ' ' . $originalTimeStr . ':00';
        } else {
            $originalTime = date('Y-m-d H:i:s');
        }

        // 3. Вставляем в БД
        $stmt = $this->pdo->prepare("
            INSERT INTO messages (user_id, to_user_id, room_id, text, file_paths, forwarded_from_id, forwarded_time, forwarded_first_name, forwarded_last_name) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $result = $stmt->execute([
            $me,
            $toUserId,
            $roomId,
            $text,
            $filePaths,
            $originalSenderId,
            $originalTime,
            $originalSenderFirstName,
            $originalSenderLastName
        ]);

        if (!$result) {
            echo "ОШИБКА SQL: " . print_r($stmt->errorInfo(), true) . "\n";
            return;
        }

        $messageId = (int)$this->pdo->lastInsertId();
        echo "УСПЕХ! Сообщение переслано в комнату $roomId (isGroup: " . ($isGroup ? '1' : '0') . "), ID: $messageId\n";

        // 4. Формируем пакет для отправки клиентам
        $payload = json_encode([
            'type'                 => 'file_batch_with_text',
            'id'                   => $messageId,
            'from'                 => $me,
            'to'                   => $toUserId,
            'room_id'              => $roomId,
            'username'             => $from->username,
            'text'                 => $text,
            'file_paths'           => $rawFiles,
            'forwarded_from_id'    => $originalSenderId,
            'forwarded_first_name' => $originalSenderFirstName,
            'forwarded_last_name'  => $originalSenderLastName,
            'forwarded_time'       => date('H:i', strtotime($originalTime)),
            'time'                 => date('H:i'),
            'avatar_path'          => $from->avatar_path,
            'is_read'              => 0,
            'is_group'             => $isGroup,
        ]);

        // 5. Рассылаем: в группе — всем участникам, в личке — собеседнику и себе
        if ($isGroup) {
            $stmtMem = $this->pdo->prepare("SELECT user_id FROM room_members WHERE room_id = ?");
            $stmtMem->execute([$roomId]);
            foreach ($stmtMem->fetchAll(PDO::FETCH_COLUMN) as $memberId) {
                if (isset($this->users[(int)$memberId])) {
                    $this->users[(int)$memberId]->send($payload);
                }
            }
        } else {
            if (isset($this->users[$targetId])) {
                $this->users[$targetId]->send($payload);
            }
            $from->send($payload);
        }

    } catch (Exception $e) {
        echo "ИСКЛЮЧЕНИЕ ПРИ ПЕРЕСЫЛКЕ: " . $e->getMessage() . "\n";
    }
    return;
}

// === УДАЛЕНИЕ СООБЩЕНИЯ ===
if (($data['type'] ?? '') === 'delete_message') {
    $messageId = (int)($data['message_id'] ?? 0);
    if (!$messageId || !$from->user_id) return;

    try {
        // 1. Проверяем, что сообщение принадлежит тому, кто его удаляет
        $stmt = $this->pdo->prepare("SELECT room_id FROM messages WHERE id = ? AND user_id = ?");
        $stmt->execute([$messageId, $from->user_id]);
        $msg = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($msg) {
            $roomId = (int)$msg['room_id'];
            
            // 2. Удаляем из БД
            $this->pdo->prepare("DELETE FROM messages WHERE id = ?")->execute([$messageId]);
            echo "Сообщение $messageId удалено\n";

            // 3. Узнаем, кто второй участник, чтобы отправить ему команду
            $stmt = $this->pdo->prepare("SELECT user1_id, user2_id FROM rooms WHERE id = ?");
            $stmt->execute([$roomId]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);

            $payload = json_encode([
                'type' => 'message_deleted',
                'message_id' => $messageId,
                'room_id' => $roomId,
            ]);

            // Отправляем себе (чтобы сообщение исчезло)
            $from->send($payload);

            // Отправляем собеседнику (если он онлайн)
            if ($room) {
                $user1 = (int)$room['user1_id'];
                $user2 = (int)$room['user2_id'];
                $to_id = ($from->user_id === $user1) ? $user2 : $user1;

                if (isset($this->users[$to_id])) {
                    $this->users[$to_id]->send($payload);
                }
            }
        }
    } catch (Exception $e) {
        error_log("Delete message error: " . $e->getMessage());
    }
    return;
}
// === УДАЛЕНИЕ ИЗ ДРУЗЕЙ ===
if (($data['type'] ?? '') === 'remove_friend') {
    $targetId = (int)($data['target_id'] ?? 0);
    if (!$targetId || $targetId === $from->user_id) return;

    try {
        // Функция для удаления друга из JSON
        $removeFriend = function($userId, $friendId) {
            $stmt = $this->pdo->prepare("SELECT friends FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $friendsJson = $stmt->fetchColumn();
            
            $friends = [];
            if ($friendsJson) {
                $decoded = json_decode($friendsJson, true);
                if (is_array($decoded)) {
                    $friends = array_map('intval', $decoded);
                }
            }
            
            // Удаляем ID из массива
            $friends = array_values(array_filter($friends, fn($id) => $id !== (int)$friendId));
            
            $newJson = json_encode($friends);
            $upd = $this->pdo->prepare("UPDATE users SET friends = ? WHERE id = ?");
            $upd->execute([$newJson, $userId]);
        };

        // 1. Удаляем у себя
        $removeFriend($from->user_id, $targetId);
        // 2. Удаляем у второго пользователя
        $removeFriend($targetId, $from->user_id);

        // 3. Уведомляем себя
        $from->send(json_encode(['type' => 'friend_list_updated']));
        echo "Удален друг $targetId у пользователя {$from->user_id}\n";

        // 4. Уведомляем второго пользователя
        if (isset($this->users[$targetId])) {
            $this->users[$targetId]->send(json_encode(['type' => 'friend_list_updated']));
            echo "Уведомление об удалении отправлено пользователю $targetId\n";
        }

    } catch (Exception $e) {
        error_log("Remove friend error: " . $e->getMessage());
        echo "ОШИБКА ПРИ УДАЛЕНИИ: " . $e->getMessage() . "\n";
    }
    return;
}
if (($data['type'] ?? '') === 'create_group') {
    $groupName = trim($data['name'] ?? '');
    $memberIds = array_map('intval', $data['members'] ?? []);
    $creatorId = (int)$from->user_id;

    if ($groupName === '' || empty($memberIds)) return;

    try {
        $this->pdo->beginTransaction();

        // 1. Создаём группу (записываем $creatorId в user1_id)
        $stmt = $this->pdo->prepare("INSERT INTO rooms (user1_id, user2_id, is_group, group_name) VALUES (?, 0, 1, ?)");
        $stmt->execute([$creatorId, $groupName]);
        $roomId = (int)$this->pdo->lastInsertId();

        // 2. Добавляем всех участников (включая создателя)
        $allMembers = array_unique(array_merge([$creatorId], $memberIds));
        $stmtMem = $this->pdo->prepare("INSERT INTO room_members (room_id, user_id) VALUES (?, ?)");
        foreach ($allMembers as $uId) {
            $stmtMem->execute([$roomId, $uId]);
        }

        $this->pdo->commit();
        echo "Создана группа '$groupName' (ID: $roomId) пользователем $creatorId\n";

        // 3. Уведомляем всех участников группы, которые сейчас в сети
        $payload = json_encode(['type' => 'group_list_updated', 'room_id' => $roomId]);
        foreach ($allMembers as $uId) {
            if (isset($this->users[$uId])) {
                $this->users[$uId]->send($payload);
            }
        }
    } catch (Exception $e) {
        if ($this->pdo->inTransaction()) $this->pdo->rollBack();
        echo "ОШИБКА СОЗДАНИЯ ГРУППЫ: " . $e->getMessage() . "\n";
    }
    return;
}
if (($data['type'] ?? '') === 'delete_group') {
    $roomId = (int)($data['room_id'] ?? 0);
    $me = (int)$from->user_id;
    if (!$roomId) return;

    try {
        // 1. Проверяем, что это группа и $me — её создатель
        $stmt = $this->pdo->prepare("SELECT user1_id FROM rooms WHERE id = ? AND is_group = 1");
        $stmt->execute([$roomId]);
        $room = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$room || (int)$room['user1_id'] !== $me) {
            echo "Попытка удаления группы $roomId без прав от пользователя $me\n";
            return;
        }

        // 2. Запоминаем всех участников, чтобы разослать им уведомление
        $stmtUsers = $this->pdo->prepare("SELECT user_id FROM room_members WHERE room_id = ?");
        $stmtUsers->execute([$roomId]);
        $memberIds = array_map('intval', $stmtUsers->fetchAll(PDO::FETCH_COLUMN));

        // 3. Удаляем сообщения, участников и саму комнату
        $this->pdo->beginTransaction();
        $this->pdo->prepare("DELETE FROM messages WHERE room_id = ?")->execute([$roomId]);
        $this->pdo->prepare("DELETE FROM room_members WHERE room_id = ?")->execute([$roomId]);
        $this->pdo->prepare("DELETE FROM rooms WHERE id = ?")->execute([$roomId]);
        $this->pdo->commit();

        echo "Группа $roomId удалена создателем $me\n";

        // 4. Уведомляем всех участников (включая создателя)
        $payload = json_encode(['type' => 'group_deleted', 'room_id' => $roomId]);
        foreach ($memberIds as $uId) {
            if (isset($this->users[$uId])) {
                $this->users[$uId]->send($payload);
            }
        }
    } catch (Exception $e) {
        if ($this->pdo->inTransaction()) $this->pdo->rollBack();
        echo "ОШИБКА УДАЛЕНИЯ ГРУППЫ: " . $e->getMessage() . "\n";
    }
    return;
}
if (($data['type'] ?? '') === 'remove_group_member') {
    $roomId = (int)($data['room_id'] ?? 0);
    $me = (int)$from->user_id;
    $targetUserId = isset($data['user_id']) ? (int)$data['user_id'] : $me;
    if (!$roomId || !$targetUserId) return;

    try {
        $stmt = $this->pdo->prepare("SELECT user1_id FROM rooms WHERE id = ? AND is_group = 1");
        $stmt->execute([$roomId]);
        $room = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$room) return;

        $isCreator = ((int)$room['user1_id'] === $me);
        $isSelf = ($targetUserId === $me);

        // Разрешаем только создателю кикать других, либо пользователю выходить самому (кроме создателя)
        if ((!$isCreator && !$isSelf) || ($isCreator && $isSelf)) return;

        $this->pdo->prepare("DELETE FROM room_members WHERE room_id = ? AND user_id = ?")->execute([$roomId, $targetUserId]);
        echo "Пользователь $targetUserId удален из группы $roomId\n";

        // Уведомляем удалённого пользователя (чтобы группа исчезла у него)
        if (isset($this->users[$targetUserId])) {
            $this->users[$targetUserId]->send(json_encode(['type' => 'group_deleted', 'room_id' => $roomId]));
        }

        // Уведомляем остальных участников группы (чтобы обновился счётчик и аватарки)
        $stmtUsers = $this->pdo->prepare("SELECT user_id FROM room_members WHERE room_id = ?");
        $stmtUsers->execute([$roomId]);
        $remainingIds = array_map('intval', $stmtUsers->fetchAll(PDO::FETCH_COLUMN));

        $payload = json_encode(['type' => 'group_list_updated', 'room_id' => $roomId]);
        foreach ($remainingIds as $uId) {
            if (isset($this->users[$uId])) {
                $this->users[$uId]->send($payload);
            }
        }
    } catch (Exception $e) {
        echo "ОШИБКА ВЫХОДА ИЗ ГРУППЫ: " . $e->getMessage() . "\n";
    }
    return;
}

if (($data['type'] ?? '') === 'handle_request') {
    echo "\n=== ПОЛУЧЕНА КОМАНДА handle_request ===\n";
    echo "От пользователя: {$from->user_id}\n";
    echo "requestId: " . ($data['request_id'] ?? 'НЕТ') . "\n";
    echo "action: " . ($data['action'] ?? 'НЕТ') . "\n";

    $requestId = (int)($data['request_id'] ?? 0);
    $action = $data['action'] ?? '';

    if (!$requestId || !in_array($action, ['accept', 'reject'])) {
        echo "ОШИБКА: Неверные данные (requestId = $requestId, action = $action)\n";
        return;
    }

    try {
        $stmt = $this->pdo->prepare("SELECT sender_id FROM friend_requests WHERE id = ? AND receiver_id = ? AND status = 'pending'");
        $stmt->execute([$requestId, $from->user_id]);
        $req = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($req) {
            echo "Заявка найдена! Отправитель: {$req['sender_id']}\n";
            $senderId = (int)$req['sender_id'];

            if ($action === 'accept') {
                $this->pdo->prepare("UPDATE friend_requests SET status = 'accepted' WHERE id = ?")->execute([$requestId]);

                // Функция для безопасного добавления друга (приводим всё к int)
                $addFriend = function($userId, $friendId) {
                    $stmt = $this->pdo->prepare("SELECT friends FROM users WHERE id = ?");
                    $stmt->execute([$userId]);
                    $friendsJson = $stmt->fetchColumn();
                    
                    $friends = [];
                    if ($friendsJson) {
                        $decoded = json_decode($friendsJson, true);
                        if (is_array($decoded)) {
                            $friends = array_map('intval', $decoded); 
                        }
                    }
                    
                    if (!in_array((int)$friendId, $friends)) {
                        $friends[] = (int)$friendId;
                        $newJson = json_encode(array_values($friends));
                        $upd = $this->pdo->prepare("UPDATE users SET friends = ? WHERE id = ?");
                        $upd->execute([$newJson, $userId]);
                        echo "Добавили друга $friendId пользователю $userId\n";
                    }
                };

                // 1. Добавляем отправителя в список того, кто принял заявку (себе)
                $addFriend($from->user_id, $senderId);
                
                // 2. Добавляем того, кто принял, в список отправителя
                $addFriend($senderId, $from->user_id);

                // 3. УВЕДОМЛЯЕМ ТОГО, КТО ПРИНЯЛ (чтобы у него обновился список друзей)
                $from->send(json_encode([
                    'type' => 'friend_list_updated'
                ]));
                echo "Уведомление об обновлении списка друзей отправлено пользователю {$from->user_id}\n";

            } else {
                $this->pdo->prepare("UPDATE friend_requests SET status = 'rejected' WHERE id = ?")->execute([$requestId]);
                echo "Заявка отклонена\n";
            }

            // 4. Уведомляем отправителя о результате (чтобы у него тоже обновился список)
            if (isset($this->users[$senderId])) {
                $this->users[$senderId]->send(json_encode([
                    'type' => 'request_handled',
                    'request_id' => $requestId,
                    'action' => $action,
                    'by_user_id' => $from->user_id
                ]));
                echo "Уведомление отправлено отправителю $senderId\n";
            }
        } else {
            echo "ОШИБКА: Заявка с ID $requestId не найдена в БД для получателя {$from->user_id}\n";
        }
    } catch (Exception $e) {
        error_log("Handle request error: " . $e->getMessage());
        echo "PHP ERROR: " . $e->getMessage() . "\n";
    }
    return;
}
        // === ТЕКСТОВОЕ СООБЩЕНИЕ ===
       // === ТЕКСТОВОЕ СООБЩЕНИЕ ===
if (($data['type'] ?? '') === 'message' && isset($data['room_id'])) {
    $text    = trim($data['text'] ?? '');
    $room_id = (int)$data['room_id'];
    $me      = (int)$from->user_id;

    if ($text === '' || !$me || !$room_id) return;

    // 1. Получаем данные комнаты из таблицы rooms
    $stmt = $this->pdo->prepare("SELECT user1_id, user2_id, is_group FROM rooms WHERE id = ?");
    $stmt->execute([$room_id]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) return;

    $isGroup = (bool)$room['is_group'];

    // 2. Проверяем доступ в зависимости от типа чата
    if ($isGroup) {
        // Для группы проверяем участие в room_members
        $stmt = $this->pdo->prepare("SELECT 1 FROM room_members WHERE room_id = ? AND user_id = ?");
        $stmt->execute([$room_id, $me]);
        if (!$stmt->fetch()) {
            $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к группе']));
            return;
        }
    } else {
        // Для личного чата проверяем user1_id и user2_id в таблице rooms
        if ((int)$room['user1_id'] !== $me && (int)$room['user2_id'] !== $me) {
            $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к личному чату']));
            return;
        }
    }

    // 3. Сохраняем сообщение в БД
    $stmt = $this->pdo->prepare("INSERT INTO messages (user_id, room_id, text) VALUES (?, ?, ?)");
    $stmt->execute([$me, $room_id, $text]);
    $message_id = (int)$this->pdo->lastInsertId();

    $payload = json_encode([
        'type'        => 'message',
        'id'          => $message_id,
        'from'        => $me,
        'room_id'     => $room_id,
        'username'    => $from->username,
        'text'        => $text,
        'time'        => date('H:i'),
        'avatar_path' => $from->avatar_path,
        'is_read'     => 0,
        'is_group'    => $isGroup,
    ]);

    if ($isGroup) {
        // Для группы — шлём всем участникам из room_members
        $stmt = $this->pdo->prepare("SELECT user_id FROM room_members WHERE room_id = ?");
        $stmt->execute([$room_id]);
        $members = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($members as $memberId) {
            if (isset($this->users[(int)$memberId])) {
                $this->users[(int)$memberId]->send($payload);
            }
        }
    } else {
        // Для личного чата — определяем ID собеседника из user1_id / user2_id
        $to_id = ((int)$room['user1_id'] === $me) ? (int)$room['user2_id'] : (int)$room['user1_id'];

        if ($to_id && isset($this->users[$to_id])) {
            $this->users[$to_id]->send($payload);
        }
        $from->send($payload);
    }
    return;
}


        // === МАССИВ КАРТИНОК (без текста) ===
        if (($data['type'] ?? '') === 'image_batch' && isset($data['room_id'])) {
    $room_id    = (int)$data['room_id'];
    $imagePaths = $data['image_paths'] ?? [];
    $me         = (int)$from->user_id;

    if (!is_array($imagePaths) || empty($imagePaths) || !$me || !$room_id) {
        return;
    }

    // 1. Запрашиваем user1_id, user2_id и is_group
    $stmt = $this->pdo->prepare(
        "SELECT user1_id, user2_id, is_group FROM rooms WHERE id = ?"
    );
    $stmt->execute([$room_id]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) {
        $from->send(json_encode(['type' => 'error', 'text' => 'Комната не найдена']));
        return;
    }

    $isGroup = (bool)$room['is_group'];
    $to_id   = 0;

    // 2. Проверяем доступ и определяем получателя
    if ($isGroup) {
        $stmt = $this->pdo->prepare("SELECT 1 FROM room_members WHERE room_id = ? AND user_id = ?");
        $stmt->execute([$room_id, $me]);
        if (!$stmt->fetch()) {
            $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к группе']));
            return;
        }
    } else {
        $user1 = (int)$room['user1_id'];
        $user2 = (int)$room['user2_id'];

        if ($me !== $user1 && $me !== $user2) {
            $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к комнате']));
            return;
        }
        $to_id = ($me === $user1) ? $user2 : $user1;
    }

    // 3. Сохраняем в messages
    $stmt = $this->pdo->prepare(
        "INSERT INTO messages (user_id, to_user_id, room_id, text, image_paths) 
         VALUES (?, ?, ?, NULL, ?)"
    );
    $result = $stmt->execute([
        $me,
        $to_id,
        $room_id,
        json_encode($imagePaths)
    ]);

    if (!$result) {
        error_log("INSERT FAILED: " . print_r($stmt->errorInfo(), true));
        return;
    }

    $message_id = (int)$this->pdo->lastInsertId();

    $payload = json_encode([
        'type'        => 'image_batch',
        'id'          => $message_id,
        'from'        => $me,
        'to'          => $to_id,
        'room_id'     => $room_id,
        'username'    => $from->username,
        'image_paths' => $imagePaths,
        'time'        => date('H:i'),
        'avatar_path' => $from->avatar_path,
        'is_read'     => 0,
        'is_group'    => $isGroup,
    ]);

    // 4. Рассылка: всем участникам группы или одному собеседнику в личке
    if ($isGroup) {
        $stmt = $this->pdo->prepare("SELECT user_id FROM room_members WHERE room_id = ?");
        $stmt->execute([$room_id]);
        $members = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($members as $memberId) {
            if (isset($this->users[(int)$memberId])) {
                $this->users[(int)$memberId]->send($payload);
            }
        }
    } else {
        if ($to_id && isset($this->users[$to_id])) {
            $this->users[$to_id]->send($payload);
        }
        $from->send($payload);
    }
    return;
}


        // === МАССИВ КАРТИНОК + ТЕКСТ ===
        if (($data['type'] ?? '') === 'image_batch_with_text' && isset($data['room_id'])) {
    $room_id    = (int)$data['room_id'];
    $imagePaths = $data['image_paths'] ?? [];
    $text       = trim($data['text'] ?? '');
    $me         = (int)$from->user_id;

    if (!is_array($imagePaths) || empty($imagePaths) || !$me || !$room_id) {
        return;
    }

    // 1. Запрашиваем user1_id, user2_id и is_group
    $stmt = $this->pdo->prepare(
        "SELECT user1_id, user2_id, is_group FROM rooms WHERE id = ?"
    );
    $stmt->execute([$room_id]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) {
        $from->send(json_encode(['type' => 'error', 'text' => 'Комната не найдена']));
        return;
    }

    $isGroup = (bool)$room['is_group'];
    $to_id   = 0;

    // 2. Проверяем доступ и определяем получателя
    if ($isGroup) {
        $stmt = $this->pdo->prepare("SELECT 1 FROM room_members WHERE room_id = ? AND user_id = ?");
        $stmt->execute([$room_id, $me]);
        if (!$stmt->fetch()) {
            $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к группе']));
            return;
        }
    } else {
        $user1 = (int)$room['user1_id'];
        $user2 = (int)$room['user2_id'];

        if ($me !== $user1 && $me !== $user2) {
            $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к комнате']));
            return;
        }
        $to_id = ($me === $user1) ? $user2 : $user1;
    }

    // 3. Сохраняем в messages
    $stmt = $this->pdo->prepare(
        "INSERT INTO messages (user_id, to_user_id, room_id, text, image_paths) 
         VALUES (?, ?, ?, ?, ?)"
    );
    $result = $stmt->execute([
        $me,
        $to_id,
        $room_id,
        $text !== '' ? $text : null,
        json_encode($imagePaths)
    ]);

    if (!$result) {
        error_log("INSERT FAILED: " . print_r($stmt->errorInfo(), true));
        return;
    }

    $message_id = (int)$this->pdo->lastInsertId();

    $payload = json_encode([
        'type'        => 'image_batch_with_text',
        'id'          => $message_id,
        'from'        => $me,
        'to'          => $to_id,
        'room_id'     => $room_id,
        'username'    => $from->username,
        'image_paths' => $imagePaths,
        'text'        => $text,
        'time'        => date('H:i'),
        'avatar_path' => $from->avatar_path,
        'is_read'     => 0,
        'is_group'    => $isGroup,
    ]);

    // 4. Рассылка: всем участникам группы или одному собеседнику в личке
    if ($isGroup) {
        $stmt = $this->pdo->prepare("SELECT user_id FROM room_members WHERE room_id = ?");
        $stmt->execute([$room_id]);
        $members = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($members as $memberId) {
            if (isset($this->users[(int)$memberId])) {
                $this->users[(int)$memberId]->send($payload);
            }
        }
    } else {
        if ($to_id && isset($this->users[$to_id])) {
            $this->users[$to_id]->send($payload);
        }
        $from->send($payload);
    }
    return;
}


        // === ФАЙЛЫ + ТЕКСТ (новый блок) ===
        if (($data['type'] ?? '') === 'file_batch_with_text' && isset($data['room_id'])) {
    $room_id   = (int)$data['room_id'];
    $filePaths = $data['file_paths'] ?? [];
    $text      = trim($data['text'] ?? '');
    $me        = (int)$from->user_id;

    if (!is_array($filePaths) || (empty($filePaths) && $text === '') || !$me || !$room_id) {
        return;
    }

    // 1. Запрашиваем user1_id, user2_id И is_group
    $stmt = $this->pdo->prepare(
        "SELECT user1_id, user2_id, is_group FROM rooms WHERE id = ?"
    );
    $stmt->execute([$room_id]);
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) {
        $from->send(json_encode(['type' => 'error', 'text' => 'Комната не найдена']));
        return;
    }

    $isGroup = (bool)$room['is_group'];
    $to_id   = 0;

    // 2. Проверяем доступ и определяем получателя в зависимости от типа чата
    if ($isGroup) {
        $stmt = $this->pdo->prepare("SELECT 1 FROM room_members WHERE room_id = ? AND user_id = ?");
        $stmt->execute([$room_id, $me]);
        if (!$stmt->fetch()) {
            $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к группе']));
            return;
        }
    } else {
        $user1 = (int)$room['user1_id'];
        $user2 = (int)$room['user2_id'];

        if ($me !== $user1 && $me !== $user2) {
            $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к комнате']));
            return;
        }
        $to_id = ($me === $user1) ? $user2 : $user1;
    }

    // 3. Сохраняем в messages
    $stmt = $this->pdo->prepare(
        "INSERT INTO messages (user_id, to_user_id, room_id, text, file_paths)
         VALUES (?, ?, ?, ?, ?)"
    );
    $result = $stmt->execute([
        $me,
        $to_id,
        $room_id,
        $text !== '' ? $text : null,
        !empty($filePaths) ? json_encode($filePaths) : null,
    ]);

    if (!$result) {
        error_log("INSERT FAILED: " . print_r($stmt->errorInfo(), true));
        return;
    }

    $message_id = (int)$this->pdo->lastInsertId();

    $payload = json_encode([
        'type'        => 'file_batch_with_text',
        'id'          => $message_id,
        'from'        => $me,
        'to'          => $to_id,
        'room_id'     => $room_id,
        'username'    => $from->username,
        'file_paths'  => $filePaths,
        'text'        => $text,
        'time'        => date('H:i'),
        'avatar_path' => $from->avatar_path,
        'is_read'     => 0,
        'is_group'    => $isGroup,
    ]);

    // 4. Рассылка: в группе — всем из room_members, в личке — собеседнику и себе
    if ($isGroup) {
        $stmt = $this->pdo->prepare("SELECT user_id FROM room_members WHERE room_id = ?");
        $stmt->execute([$room_id]);
        $members = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($members as $memberId) {
            if (isset($this->users[(int)$memberId])) {
                $this->users[(int)$memberId]->send($payload);
            }
        }
    } else {
        if ($to_id && isset($this->users[$to_id])) {
            $this->users[$to_id]->send($payload);
        }
        $from->send($payload);
    }
    return;
}


        // === ОБРАБОТКА "ПРОЧИТАНО" ===
        if (($data['type'] ?? '') === 'mark_all_read') {
    $room_id = (int)($data['room_id'] ?? 0);
    $user_id = (int)$from->user_id;

    if (!$room_id || !$user_id) {
        return;
    }

    // 1. Проверяем, группа это или личный чат
    $stmtRoom = $this->pdo->prepare("SELECT is_group FROM rooms WHERE id = ?");
    $stmtRoom->execute([$room_id]);
    $isGroup = (bool)$stmtRoom->fetchColumn();

    if ($isGroup) {
        // ДЛЯ ГРУППЫ: записываем все непрочитанные пользователем сообщения в таблицу message_reads
        $stmtUnread = $this->pdo->prepare("
            SELECT m.id, m.user_id 
            FROM messages m
            LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = ?
            WHERE m.room_id = ? AND m.user_id != ? AND mr.message_id IS NULL
        ");
        $stmtUnread->execute([$user_id, $room_id, $user_id]);
        $unreadMessages = $stmtUnread->fetchAll(PDO::FETCH_ASSOC);

        if (empty($unreadMessages)) {
            return;
        }

        // INSERT IGNORE защитит от дублей, если в таблице стоит уникальный индекс (message_id, user_id)
        $insertRead = $this->pdo->prepare("
            INSERT IGNORE INTO message_reads (message_id, user_id) VALUES (?, ?)
        ");

        foreach ($unreadMessages as $msg) {
            $message_id = (int)$msg['id'];
            $sender_id  = (int)$msg['user_id'];

            $insertRead->execute([$message_id, $user_id]);

            // Опционально: ставим is_read = 1 в messages, чтобы у отправителя загорелись две галочки
            $this->pdo->prepare("UPDATE messages SET is_read = 1 WHERE id = ?")->execute([$message_id]);

            if (isset($this->users[$sender_id])) {
                $this->users[$sender_id]->send(json_encode([
                    'type'       => 'message_read',
                    'message_id' => $message_id,
                    'room_id'    => $room_id,
                ]));
            }
        }
    } else {
        // ДЛЯ ЛИЧНОГО ЧАТА: оставляем вашу прежнюю логику через is_read = 1
        $stmt = $this->pdo->prepare(
            "SELECT id, user_id FROM messages 
             WHERE room_id = ? AND is_read = 0 AND user_id != ?"
        );
        $stmt->execute([$room_id, $user_id]);
        $unreadMessages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($unreadMessages)) {
            return;
        }

        $updateStmt = $this->pdo->prepare(
            "UPDATE messages SET is_read = 1 
             WHERE room_id = ? AND is_read = 0 AND user_id != ?"
        );
        $updateStmt->execute([$room_id, $user_id]);

        foreach ($unreadMessages as $msg) {
            $sender_id = (int)$msg['user_id'];
            $message_id = (int)$msg['id'];

            if (isset($this->users[$sender_id])) {
                $this->users[$sender_id]->send(json_encode([
                    'type'       => 'message_read',
                    'message_id' => $message_id,
                    'room_id'    => $room_id,
                ]));
            }
        }
    }
    return;
}


        error_log("UNKNOWN TYPE: " . ($data['type'] ?? 'NULL'));
    }

    function onClose(ConnectionInterface $conn) {
        $userId = $conn->user_id;
        $this->clients->detach($conn);

        if ($userId && isset($this->users[$userId])) {
            unset($this->users[$userId]);
        }

        echo "Отключение: {$conn->resourceId}\n";

        if ($userId) {
            $this->broadcastStatus($userId, false);
        }
    }

    function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Ошибка: " . $e->getMessage() . "\n";
        $conn->close();
    }

    private function broadcastStatus($userId, $isOnline, $except = null) {
        $payload = json_encode([
            'type'      => 'user_status',
            'user_id'   => $userId,
            'is_online' => $isOnline,
        ]);

        foreach ($this->clients as $client) {
            if ($client !== $except) {
                $client->send($payload);
            }
        }
    }

    private function sendOnlineList(ConnectionInterface $conn) {
        foreach ($this->clients as $client) {
            if ($client !== $conn && $client->user_id) {
                $conn->send(json_encode([
                    'type'      => 'user_status',
                    'user_id'   => $client->user_id,
                    'is_online' => true,
                ]));
            }
        }
    }
}

echo "Сервер запущен на порту 8081...\n";
$server = IoServer::factory(
    new HttpServer(new WsServer(new Chat($pdo))),
    8081
);
$server->run();
