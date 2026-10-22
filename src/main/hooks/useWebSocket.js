import { useEffect, useRef, useState } from 'react';
import { USE_MOCK } from '../../config';
import { WS_URL } from '../../config';

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

    // === МОК: без реального сокета ===
    if (USE_MOCK) {
      setIsConnected(true);

      // через 3 секунды «прилетает» новое сообщение — проверить рендер
      const t = setTimeout(() => {
        onMessage({
          id: Date.now(),
          type: 'message',
          from: 11,
          room_id: activeRoomIdRef.current || 1,
          username: 'Маша Машина',
          text: 'Мок-сообщение в реальном времени',
          time: new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          is_read: 0,
          avatar_path: null,
        });
      }, 3000);

      return () => clearTimeout(t);
    }

    // === РЕАЛЬНЫЙ WS ===
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    const markRead = (roomId) => {
      socketRef.current?.send(
        JSON.stringify({
          type: 'mark_all_read',
          room_id: roomId,
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
        JSON.stringify({
          type: 'auth',
          token: localStorage.getItem('chat_token') || '',
        })
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
        case 'file_batch_with_text':
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
    // === МОК: локальное «эхо» ===
    if (USE_MOCK) {
      if (payload.type === 'message' && payload.text) {
        onMessage({
          id: Date.now(),
          type: 'message',
          from: currentUser.id,
          room_id: payload.room_id,
          username: `${currentUser.first_name} ${currentUser.last_name}`,
          text: payload.text,
          time: new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          is_read: 0,
          avatar_path: currentUser.avatar_path,
        });
      }
      // mark_all_read в моке просто игнорируем
      return true;
    }

    // === РЕАЛЬНЫЙ WS ===
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
      return true;
    }
    return false;
  };

  return { socketRef, isConnected, send };
}