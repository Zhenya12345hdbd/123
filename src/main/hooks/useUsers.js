import { useEffect, useState, useCallback } from 'react';
import { fetchUsers, searchUsers } from '../api/users';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Загрузка всех пользователей
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
    return () => { cancelled = true; };
  }, []);

  // Функция поиска
  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const data = await searchUsers(query);
      setSearchResults(data);
    } catch (err) {
      console.error('Ошибка поиска:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults(null);
  }, []);

  return { users, searchResults, isSearching, search, clearSearch };
}