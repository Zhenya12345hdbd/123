// src/api/users.js
import { API } from "../../config";
import { request } from './request';

export async function fetchUsers() {
  return request(`${API.users}?t=${Date.now()}`);
}

export async function searchUsers(query) {
  // encodeURIComponent — обязательно, чтобы русские буквы и пробелы передались корректно
  const url = `${API.users}?search=${encodeURIComponent(query)}&t=${Date.now()}`;
  return request(url);
}

export async function fetchUnreadCounts() {
  return request(API.unread);
}
export async function fetchFriends() {
  return request(`${API.base}/get_friends.php?t=${Date.now()}`);
}