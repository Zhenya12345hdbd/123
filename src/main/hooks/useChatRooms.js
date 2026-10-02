import { useCallback } from 'react';
import { createRoom, fetchHistory } from '../api/rooms';
import { normalizeHistory } from '../utils/normalizeHistory';

export function useChatRooms({ currentUser, activeRoomIdRef }) {
  const openRoom = useCallback(
    async ({ userId, name, onOpen, onLoaded }) => {
      try {
        const data = await createRoom(currentUser.id, userId);
        if (!data.room_id) return null;

        activeRoomIdRef.current = data.room_id;
        onOpen({ roomId: data.room_id, chatId: userId, chatName: name });

        const hist = await fetchHistory(data.room_id, currentUser.id);
        onLoaded(normalizeHistory(hist));

        return data.room_id;
      } catch (e) {
        console.error('Ошибка при открытии комнаты:', e);
        return null;
      }
    },
    [currentUser, activeRoomIdRef]
  );

  return { openRoom };
}