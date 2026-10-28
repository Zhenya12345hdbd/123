// src/hooks/useFriends.js
import { useState, useEffect, useCallback } from 'react';
import { fetchFriends } from '../api/users';

export function useFriends(currentUser) {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFriends = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchFriends();
      setFriends(data);
    } catch (err) {
      console.error('Ошибка загрузки друзей:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) loadFriends();
  }, [currentUser, loadFriends]);

  return { friends, isLoading, loadFriends, setFriends };
}