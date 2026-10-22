// src/config.js

const API_BASE = process.env.REACT_APP_API_BASE || '';
const WS_BASE  = process.env.REACT_APP_WS_BASE  || 'ws://localhost:8081';

export const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

export const API = {
  base:       API_BASE,
  login:      `${API_BASE}/login.php`,
  register:   `${API_BASE}/register.php`,
  logout:     `${API_BASE}/logout.php`,
  users:      `${API_BASE}/get_users.php`,
  unread:     `${API_BASE}/get_unread_counts.php`,
  history:    `${API_BASE}/get_history.php`,
  createRoom: `${API_BASE}/create_room.php`,
  upload:     `${API_BASE}/upload.php`,
  captcha:    `${API_BASE}/captcha.php`,
};

export const WS_URL = WS_BASE;