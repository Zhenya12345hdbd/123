import { useCallback, useRef, useState } from 'react';
import { fetchHistory } from '../api/rooms';

export function useChatHistory(currentUser) {
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const roomIdRef = useRef(null);
  const loadingRef = useRef(false);
  // ref на сообщения, чтобы loadOlder не зависел от messages
  const messagesRef = useRef([]);

  const updateMessages = useCallback((updater) => {
    setMessages((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      messagesRef.current = next;
      return next;
    });
  }, []);

  const setInitial = useCallback((msgs, more) => {
    loadingRef.current = false;
    setIsLoadingMore(false);
    setHasMore(!!more);
    updateMessages(msgs);
  }, [updateMessages]);

  const setRoomId = useCallback((id) => {
    roomIdRef.current = id;
  }, []);

  const appendMessage = useCallback((msg) => {
    updateMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, [updateMessages]);

  const patchMessage = useCallback((id, patch) => {
    updateMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }, [updateMessages]);

  const loadOlder = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    const roomId = roomIdRef.current;
    if (!roomId) return;

    const oldest = messagesRef.current[0];
    const beforeId = oldest?.id;
    if (beforeId == null) return;

    loadingRef.current = true;
    setIsLoadingMore(true);

    try {
      const data = await fetchHistory(roomId, currentUser.id, {
        beforeId,
        limit: 10,
      });

      updateMessages((prev) => {
        const existing = new Set(prev.map((m) => m.id));
        const fresh = (data.messages || []).filter((m) => !existing.has(m.id));
        return [...fresh, ...prev];
      });
      setHasMore(!!data.has_more);
    } catch (e) {
      console.error('Ошибка подгрузки истории:', e);
    } finally {
      loadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore, currentUser, updateMessages]);

  return {
    messages,
    setMessages: updateMessages,
    hasMore,
    isLoadingMore,
    setInitial,
    setRoomId,
    appendMessage,
    patchMessage,
    loadOlder,
  };
}