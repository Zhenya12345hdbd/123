import { useCallback } from 'react';
import { createRoom, fetchHistory } from '../api/rooms';

export function useChatRooms({ activeRoomIdRef }) {
  const openRoom = useCallback(
    async ({ userId, name, isGroup = false, onOpen, onLoaded }) => {
      try {
        let roomId = userId; // Для группы userId — это уже готовый room_id

        // Если это личный чат, создаем или получаем комнату на сервере
        if (!isGroup) {
          const data = await createRoom(userId);
          if (!data || !data.room_id) return null;
          roomId = data.room_id;
        }

        activeRoomIdRef.current = roomId;
        onOpen({ roomId, chatId: userId, chatName: name });

        // Загружаем историю сообщений по roomId
        const hist = await fetchHistory(roomId, { limit: 10 });
        onLoaded(hist.messages || [], !!hist.has_more);

        return roomId;
      } catch (e) {
        console.error('Ошибка при открытии комнаты:', e);
        return null;
      }
    },
    [activeRoomIdRef]
  );

  return { openRoom };
}