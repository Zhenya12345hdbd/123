// src/api/request.js

import { USE_MOCK } from "../../config";
import {
  MOCK_USERS,
  MOCK_UNREAD,
  MOCK_HISTORY,
  MOCK_LOGIN,
  MOCK_REGISTER,
  MOCK_CREATE_ROOM,
  MOCK_UPLOAD,
  MOCK_FRIENDS
} from './mock';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function request(url, options = {}) {
  if (!USE_MOCK) {
    const res = await fetch(url, { credentials: 'include', ...options });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  await delay(150);

  // --- 1. Обработка пользователей (с поиском) ---
  if (url.includes('get_users.php')) {
    // Отделяем query-строку от пути
    const queryString = url.split('?')[1] || '';
    const params = new URLSearchParams(queryString);
    const search = (params.get('search') || '').trim().toLowerCase();

    if (search) {
      console.log(`[MOCK] Поиск пользователей по: "${search}"`);
      const filtered = MOCK_USERS.filter(u => {
        const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
        return fullName.includes(search);
      });
      console.log('[MOCK] Найдено:', filtered.length);
      return filtered;
    }
    return MOCK_USERS;
  }
  if (url.includes('remove_friend.php')) {
  console.log('[MOCK] Удаление друга');
  // В реальном моке можно было бы удалять из массива MOCK_FRIENDS,
  // но для простоты просто возвращаем успех.
  return { success: true };
}
if (url.includes('add_friend.php')) {
  console.log('[MOCK] Добавление друга:', options.body);
  return { success: true };
}
  if (url.includes('get_friends.php')) return MOCK_FRIENDS;

  // --- 2. Остальные эндпоинты ---
  if (url.includes('get_unread_counts.php')) return MOCK_UNREAD;
  if (url.includes('get_history.php'))       return MOCK_HISTORY;
  if (url.includes('create_room.php'))       return MOCK_CREATE_ROOM;
  if (url.includes('login.php'))             return MOCK_LOGIN;
  if (url.includes('register.php'))          return MOCK_REGISTER;
  if (url.includes('logout.php'))            return { success: true };
  if (url.includes('upload.php'))            return MOCK_UPLOAD;

  throw new Error(`[mock] Нет обработчика для ${url}`);
}