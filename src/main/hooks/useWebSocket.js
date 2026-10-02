import { useEffect, useRef, useState } from 'react';

export function useWebSocket({
  currentUser,
  activeRoomIdRef,
  onMessage,
  onUnreadIncrement,
  onStatus,
}) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    const socket = new WebSocket('ws://localhost:8081');
    socketRef.current = socket;

    const markRead = (roomId) => {
      socketRef.current?.send(
        JSON.stringify({
          type: 'mark_all_read',
          room_id: roomId,
          user_id: currentUser.id,
        })
      );
    };

    const handleIncomingChat = (data) => {
      const isActive =
        String(data.room_id) === String(activeRoomIdRef.current);
      const fromOther = String(data.from) !== String(currentUser.id);

      if (isActive) {
        onMessage(data);
        if (fromOther) markRead(data.room_id);
      } else if (fromOther) {
        onUnreadIncrement(data.from);
      }
    };

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(
        JSON.stringify({ type: 'auth', user_id: currentUser.id })
      );
    };

    socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.error('Ошибка парсинга:', e);
        return;
      }

      switch (data.type) {
        case 'message':
        case 'image_batch':
        case 'image_batch_with_text':
          handleIncomingChat(data);
          break;

        case 'image': {
          const normalized = {
            ...data,
            type: 'image_batch',
            image_paths: [data.image_path],
          };
          handleIncomingChat(normalized);
          break;
        }

        case 'message_read':
          onMessage({ ...data, __read: true });
          break;

        case 'user_status':
          onStatus?.({ userId: data.user_id, isOnline: data.is_online });
          break;

        default:
          break;
      }
    };

    socket.onclose = () => setIsConnected(false);
    socket.onerror = (err) => console.error('WebSocket Error:', err);

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const send = (payload) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
      return true;
    }
    return false;
  };

  return { socketRef, isConnected, send };
}