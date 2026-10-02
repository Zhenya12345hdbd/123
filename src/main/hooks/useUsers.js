import { useEffect, useState } from 'react';
import { fetchUsers } from '../api/users';

export function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchUsers();
        if (!cancelled) setUsers(data);
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { users, setUsers };
}