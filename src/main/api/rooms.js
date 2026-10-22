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