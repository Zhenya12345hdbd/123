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
} from './mock';

// небольшая задержка, чтобы UI показал «загрузку» (как в реальности)
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function request(url, options = {}) {
  if (!USE_MOCK) {
    const res = await fetch(url, { credentials: 'include', ...options });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
  }

  // === МОК ===
  await delay(150); // имитация сети

  if (url.includes('get_users.php'))         return MOCK_USERS;
  if (url.includes('get_unread_counts.php')) return MOCK_UNREAD;
  if (url.includes('get_history.php'))       return MOCK_HISTORY;
  if (url.includes('create_room.php'))       return MOCK_CREATE_ROOM;
  if (url.includes('login.php'))             return MOCK_LOGIN;
  if (url.includes('register.php'))          return MOCK_REGISTER;
  if (url.includes('logout.php'))            return { success: true };
  if (url.includes('upload.php'))            return MOCK_UPLOAD;

  throw new Error(`[mock] Нет обработчика для ${url}`);
}