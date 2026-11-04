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
        // Сохраняем в БД
        $stmt = $this->pdo->prepare("INSERT IGNORE INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)");
        $stmt->execute([$from->user_id, $targetId]);

        // Отправляем уведомление получателю (если он онлайн)
        if (isset($this->users[$targetId])) {
            $this->users[$targetId]->send(json_encode([
                'type' => 'new_friend_request',
                'sender_id' => $from->user_id,
                'sender_name' => $from->username,
                'sender_avatar' => $from->avatar_path,
                'request_id' => $this->pdo->lastInsertId(),
            ]));
        }
    } catch (Exception $e) {
        error_log("Friend request error: " . $e->getMessage());
    }
    return;
}
// === ОТВЕТ НА ЗАЯВКУ (ПРИНЯТЬ/ОТКЛОНИТЬ) ===
if (($data['type'] ?? '') === 'handle_request') {
    $requestId = (int)($data['request_id'] ?? 0);
    $action = $data['action'] ?? ''; // 'accept' или 'reject'

    if (!$requestId || !in_array($action, ['accept', 'reject'])) return;

    try {
        // Находим заявку
        $stmt = $this->pdo->prepare("SELECT sender_id FROM friend_requests WHERE id = ? AND receiver_id = ? AND status = 'pending'");
        $stmt->execute([$requestId, $from->user_id]);
        $req = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($req) {
            $senderId = (int)$req['sender_id'];

            if ($action === 'accept') {
                // Меняем статус
                $this->pdo->prepare("UPDATE friend_requests SET status = 'accepted' WHERE id = ?")->execute([$requestId]);

                // Добавляем друг друга в friends (JSON)
                // 1. Себе
                $stmt = $this->pdo->prepare("SELECT friends FROM users WHERE id = ?");
                $stmt->execute([$from->user_id]);
                $myFriends = json_decode($stmt->fetchColumn(), true) ?: [];
                if (!in_array($senderId, $myFriends)) {
                    $myFriends[] = $senderId;
                    $this->pdo->prepare("UPDATE users SET friends = ? WHERE id = ?")->execute([json_encode($myFriends), $from->user_id]);
                }
                // 2. Отправителю
                $stmt = $this->pdo->prepare("SELECT friends FROM users WHERE id = ?");
                $stmt->execute([$senderId]);
                $theirFriends = json_decode($stmt->fetchColumn(), true) ?: [];
                if (!in_array($from->user_id, $theirFriends)) {
                    $theirFriends[] = $from->user_id;
                    $this->pdo->prepare("UPDATE users SET friends = ? WHERE id = ?")->execute([json_encode($theirFriends), $senderId]);
                }
            } else {
                $this->pdo->prepare("UPDATE friend_requests SET status = 'rejected' WHERE id = ?")->execute([$requestId]);
            }

            // Уведомляем отправителя о результате
            if (isset($this->users[$senderId])) {
                $this->users[$senderId]->send(json_encode([
                    'type' => 'request_handled',
                    'request_id' => $requestId,
                    'action' => $action,
                    'by_user_id' => $from->user_id
                ]));
            }
        }
    } catch (Exception $e) {
        error_log("Handle request error: " . $e->getMessage());
    }
    return;
}
        // === ТЕКСТОВОЕ СООБЩЕНИЕ ===
        if (($data['type'] ?? '') === 'message' && isset($data['room_id'])) {
            $text    = trim($data['text'] ?? '');
            $room_id = (int)$data['room_id'];

            if ($text === '' || !$from->user_id || !$room_id) {
                return;
            }

            $stmt = $this->pdo->prepare(
                "SELECT user1_id, user2_id FROM rooms WHERE id = ?"
            );
            $stmt->execute([$room_id]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$room) {
                $from->send(json_encode(['type' => 'error', 'text' => 'Комната не найдена']));
                return;
            }

            $user1 = (int)$room['user1_id'];
            $user2 = (int)$room['user2_id'];

            if ($from->user_id !== $user1 && $from->user_id !== $user2) {
                $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к комнате']));
                return;
            }

            $to_id = ($from->user_id === $user1) ? $user2 : $user1;

            $stmt = $this->pdo->prepare(
                "INSERT INTO messages (user_id, to_user_id, room_id, text) VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([$from->user_id, $to_id, $room_id, $text]);

            $message_id = (int)$this->pdo->lastInsertId();

            $payload = json_encode([
                'type'        => 'message',
                'id'          => $message_id,
                'from'        => $from->user_id,
                'to'          => $to_id,
                'room_id'     => $room_id,
                'username'    => $from->username,
                'text'        => $text,
                'time'        => date('H:i'),
                'avatar_path' => $from->avatar_path,
                'is_read'     => 0,
            ]);

            if (isset($this->users[$to_id])) {
                $this->users[$to_id]->send($payload);
            }
            $from->send($payload);
            return;
        }

        // === МАССИВ КАРТИНОК (без текста) ===
        if (($data['type'] ?? '') === 'image_batch' && isset($data['room_id'])) {
            $room_id    = (int)$data['room_id'];
            $imagePaths = $data['image_paths'] ?? [];

            if (!is_array($imagePaths) || empty($imagePaths) || !$from->user_id) {
                return;
            }

            $stmt = $this->pdo->prepare(
                "SELECT user1_id, user2_id FROM rooms WHERE id = ?"
            );
            $stmt->execute([$room_id]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$room) {
                $from->send(json_encode(['type' => 'error', 'text' => 'Комната не найдена']));
                return;
            }

            $user1 = (int)$room['user1_id'];
            $user2 = (int)$room['user2_id'];

            if ($from->user_id !== $user1 && $from->user_id !== $user2) {
                $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к комнате']));
                return;
            }

            $to_id = ($from->user_id === $user1) ? $user2 : $user1;

            $stmt = $this->pdo->prepare(
                "INSERT INTO messages (user_id, to_user_id, room_id, text, image_paths) 
                 VALUES (?, ?, ?, NULL, ?)"
            );
            $result = $stmt->execute([
                $from->user_id,
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
                'from'        => $from->user_id,
                'to'          => $to_id,
                'room_id'     => $room_id,
                'username'    => $from->username,
                'image_paths' => $imagePaths,
                'time'        => date('H:i'),
                'avatar_path' => $from->avatar_path,
                'is_read'     => 0,
            ]);

            if (isset($this->users[$to_id])) {
                $this->users[$to_id]->send($payload);
            }
            $from->send($payload);
            return;
        }

        // === МАССИВ КАРТИНОК + ТЕКСТ ===
        if (($data['type'] ?? '') === 'image_batch_with_text' && isset($data['room_id'])) {
            $room_id    = (int)$data['room_id'];
            $imagePaths = $data['image_paths'] ?? [];
            $text       = trim($data['text'] ?? '');

            if (!is_array($imagePaths) || empty($imagePaths) || !$from->user_id) {
                return;
            }

            $stmt = $this->pdo->prepare(
                "SELECT user1_id, user2_id FROM rooms WHERE id = ?"
            );
            $stmt->execute([$room_id]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$room) {
                $from->send(json_encode(['type' => 'error', 'text' => 'Комната не найдена']));
                return;
            }

            $user1 = (int)$room['user1_id'];
            $user2 = (int)$room['user2_id'];

            if ($from->user_id !== $user1 && $from->user_id !== $user2) {
                $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к комнате']));
                return;
            }

            $to_id = ($from->user_id === $user1) ? $user2 : $user1;

            $stmt = $this->pdo->prepare(
                "INSERT INTO messages (user_id, to_user_id, room_id, text, image_paths) 
                 VALUES (?, ?, ?, ?, ?)"
            );
            $result = $stmt->execute([
                $from->user_id,
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
                'from'        => $from->user_id,
                'to'          => $to_id,
                'room_id'     => $room_id,
                'username'    => $from->username,
                'image_paths' => $imagePaths,
                'text'        => $text,
                'time'        => date('H:i'),
                'avatar_path' => $from->avatar_path,
                'is_read'     => 0,
            ]);

            if (isset($this->users[$to_id])) {
                $this->users[$to_id]->send($payload);
            }
            $from->send($payload);
            return;
        }

        // === ФАЙЛЫ + ТЕКСТ (новый блок) ===
        if (($data['type'] ?? '') === 'file_batch_with_text' && isset($data['room_id'])) {
            $room_id   = (int)$data['room_id'];
            $filePaths = $data['file_paths'] ?? [];
            $text      = trim($data['text'] ?? '');

            if (!is_array($filePaths) || (empty($filePaths) && $text === '') || !$from->user_id) {
                return;
            }

            $stmt = $this->pdo->prepare(
                "SELECT user1_id, user2_id FROM rooms WHERE id = ?"
            );
            $stmt->execute([$room_id]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$room) {
                $from->send(json_encode(['type' => 'error', 'text' => 'Комната не найдена']));
                return;
            }

            $user1 = (int)$room['user1_id'];
            $user2 = (int)$room['user2_id'];

            if ($from->user_id !== $user1 && $from->user_id !== $user2) {
                $from->send(json_encode(['type' => 'error', 'text' => 'Нет доступа к комнате']));
                return;
            }

            $to_id = ($from->user_id === $user1) ? $user2 : $user1;

            // Сохраняем в messages — пути в file_paths (JSON), текст отдельно
            $stmt = $this->pdo->prepare(
                "INSERT INTO messages (user_id, to_user_id, room_id, text, file_paths)
                 VALUES (?, ?, ?, ?, ?)"
            );
            $result = $stmt->execute([
                $from->user_id,
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
                'from'        => $from->user_id,
                'to'          => $to_id,
                'room_id'     => $room_id,
                'username'    => $from->username,
                'file_paths'  => $filePaths,
                'text'        => $text,
                'time'        => date('H:i'),
                'avatar_path' => $from->avatar_path,
                'is_read'     => 0,
            ]);

            if (isset($this->users[$to_id])) {
                $this->users[$to_id]->send($payload);
            }
            $from->send($payload);
            return;
        }

        // === ОБРАБОТКА "ПРОЧИТАНО" ===
        if (($data['type'] ?? '') === 'mark_all_read') {
            $room_id = (int)($data['room_id'] ?? 0);
            $user_id = (int)$from->user_id;

            if (!$room_id || !$user_id || !$from->user_id) {
                return;
            }

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

            echo "Помечено прочитанными: " . count($unreadMessages) . " сообщений в комнате $room_id\n";
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
