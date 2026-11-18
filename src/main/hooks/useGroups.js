import { useState, useEffect, useCallback } from 'react';
import { API } from '../../config';
import { request } from '../api/request';

export function useGroups(currentUser) {
  const [groups, setGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  const loadGroups = useCallback(async () => {
    setIsLoadingGroups(true);
    try {
      const data = await request(`${API.base}/get_rooms.php`);
      setGroups(data);
    } catch (err) {
      console.error('Ошибка загрузки групп:', err);
    } finally {
      setIsLoadingGroups(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) loadGroups();
  }, [currentUser, loadGroups]);

  return { groups, loadGroups, isLoadingGroups };
}