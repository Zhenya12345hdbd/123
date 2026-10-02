export async function fetchUsers() {
  const res = await fetch(`get_users.php?t=${Date.now()}`);
  if (!res.ok) throw new Error('Ошибка загрузки пользователей');
  return res.json();
}

export async function fetchUnreadCounts(userId) {
  const res = await fetch(`get_unread_counts.php?user_id=${userId}`);
  if (!res.ok) throw new Error('Ошибка загрузки непрочитанных');
  return res.json();
}