import { API } from "../../config";
import { request } from './request';

export async function createRoom(user2_id) {
  return request(API.createRoom, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user2_id }),
  });
}

export async function fetchHistory(roomId, { beforeId = null, limit = 10 } = {}) {
  const params = new URLSearchParams({
    room_id: String(roomId),
    limit: String(limit),
  });
  if (beforeId != null) params.set('before_id', String(beforeId));

  return request(`${API.history}?${params.toString()}`);
}
export async function deleteGroup(roomId) {
  const token = localStorage.getItem('chat_token');
  const response = await fetch('/delete_group.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ room_id: roomId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Не удалось удалить группу');
  }
  return data;
}

export async function leaveGroup(roomId) {
  const token = localStorage.getItem('chat_token');
  const response = await fetch('/remove_member.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ room_id: roomId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Не удалось выйти из группы');
  }
  return data;
}
