import { useEffect, useState } from 'react';
import { fetchUnreadCounts } from '../api/users';

export function useUnreadCounts(currentUser) {
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchUnreadCounts(currentUser.id);
        if (!cancelled) setUnreadCounts(data);
      } catch (err) {
        console.error('Ошибка загрузки непрочитанных:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const clearForUser = (userId) => {
    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  const incrementForUser = (userId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1,
    }));
  };

  return { unreadCounts, setUnreadCounts, clearForUser, incrementForUser };
}