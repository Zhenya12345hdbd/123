import { useCallback } from 'react';
import { createRoom, fetchHistory } from '../api/rooms';

export function useChatRooms({ activeRoomIdRef }) {
  const openRoom = useCallback(
    async ({ userId, name, onOpen, onLoaded }) => {
      try {
        // 1. Передаем ТОЛЬКО id собеседника (твой id сервер/мок берет из сессии)
        const data = await createRoom(userId); 
        
        if (!data || !data.room_id) return null;

        activeRoomIdRef.current = data.room_id;
        onOpen({ roomId: data.room_id, chatId: userId, chatName: name });

        // 2. Передаем room_id и объект настроек (без userId)
        const hist = await fetchHistory(data.room_id, { limit: 10 });
        
        // 3. Загружаем историю
        onLoaded(hist.messages || [], !!hist.has_more);

        return data.room_id;
      } catch (e) {
        console.error('Ошибка при открытии комнаты:', e);
        return null;
      }
    },
    [activeRoomIdRef] // currentUser больше не нужен
  );

  return { openRoom };
}