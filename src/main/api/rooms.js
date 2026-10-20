export async function createRoom(user1_id, user2_id) {
  const res = await fetch('create_room.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user1_id, user2_id }),
  });
  if (!res.ok) throw new Error('Ошибка создания комнаты');
  return res.json();
}

export async function fetchHistory(
  roomId,
  userId,
  { beforeId = null, limit = 10 } = {}
) {
  const params = new URLSearchParams({
    room_id: String(roomId),
    user_id: String(userId),
    limit: String(limit),
  });
  if (beforeId != null) params.set('before_id', String(beforeId));

  const res = await fetch(`get_history.php?${params.toString()}`);
  if (!res.ok) throw new Error('Ошибка загрузки истории');
  return res.json(); // { messages, has_more }
}