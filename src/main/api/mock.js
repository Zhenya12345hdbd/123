// src/api/mock.js

// Пользователи (как из get_users.php)
export const MOCK_USERS = [
  { id: 1,  first_name: 'Евгений', last_name: 'Абаров',  avatar_path: null },
  { id: 2,  first_name: 'Пётр',    last_name: 'Петров',  avatar_path: null },
  { id: 11, first_name: 'Маша',    last_name: 'Машина',  avatar_path: null },
];

// Непрочитанные (как из get_unread_counts.php) — { from_user_id: count }
export const MOCK_UNREAD = { 2: 3, 11: 1 };

// История сообщений (как из get_history.php)
export const MOCK_HISTORY = {
  messages: [
    {
      id: 1, text: 'Привет!', type: 'message', from: 1, room_id: 1,
      is_read: 1, username: 'Евгений Абаров', avatar_path: null,
      time: '10:00', file_paths: null,
    },
    {
      id: 2, text: 'Как дела?', type: 'message', from: 11, room_id: 1,
      is_read: 0, username: 'Маша Машина', avatar_path: null,
      time: '10:01', file_paths: null,
    },
    {
      id: 3, text: '', type: 'file_batch_with_text', from: 1, room_id: 1,
      is_read: 1, username: 'Евгений Абаров', avatar_path: null,
      time: '10:02',
      file_paths: [
        { mime: 'image/png', name: 'mock.png', path: '/uploads/images/mock.png',
          size: 12345, type: 'images', safe_name: 'mock.png' },
      ],
    },
  ],
  has_more: false,
};

// Ответ на логин (как из login.php)
export const MOCK_LOGIN = {
  success: true,
  id: 1,
  first_name: 'Евгений',
  last_name: 'Абаров',
  avatar_path: null,
  token: 'mock-token-123',
};

// Ответ на регистрацию (как из register.php)
export const MOCK_REGISTER = {
  success: true,
  id: 100,
  first_name: 'Новый',
  last_name: 'Пользователь',
  avatar_path: null,
  token: 'mock-token-new',
};

// Ответ на создание комнаты (как из create_room.php)
export const MOCK_CREATE_ROOM = { room_id: 1 };

// Ответ на загрузку файла (как из upload.php)
export const MOCK_UPLOAD = {
  path: '/uploads/images/mock-upload.png',
  type: 'images',
  mime: 'image/png',
  name: 'mock-upload.png',
  size: 12345,
  safe_name: 'mock-upload.png',
};