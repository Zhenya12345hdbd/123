export async function createRoom(user1_id, user2_id) {
  const res = await fetch('create_room.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user1_id, user2_id }),
  });
  if (!res.ok) throw new Error('Ошибка создания комнаты');
  return res.json();
}

export async function fetchHistory(roomId, userId) {
  const res = await fetch(
    `get_history.php?room_id=${roomId}&user_id=${userId}`
  );
  if (!res.ok) throw new Error('Ошибка загрузки истории');
  return res.json();
}