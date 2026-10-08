import './main.css';
import { useRef, useState, useMemo } from 'react';

import Sidebar from './form/Sidebar';
import MessageInput from './form/MessageInput';
import MessageList from './form/MessageList';
import ChatHeader from './form/ChatHeader';

import { useUsers } from './hooks/useUsers';
import { sizeImage } from './hooks/size_image';
import { useUnreadCounts } from './hooks/useUnreadCounts';
import { useWebSocket } from './hooks/useWebSocket';
import { useAutoScroll } from './hooks/useAutoScroll';
import { usePendingFiles } from './hooks/usePendingFiles';
import { useChatRooms } from './hooks/useChatRooms';

import { uploadImage } from './api/upload';

function Main({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatName, setActiveChatName] = useState('');

  const [isUploading, setIsUploading] = useState(false);

  const chatRef = useRef(null);
  const activeRoomIdRef = useRef(null);

  const currentUser = useMemo(
    () => JSON.parse(localStorage.getItem('chat_user') || 'null'),
    []
  );

  const { users } = useUsers();
  const { unreadCounts, clearForUser, incrementForUser } =
    useUnreadCounts(currentUser);

  const {
    pendingFiles,
    handleImageSelect,
    handleImageCancel,
    handleRemoveSingleFile,
    clear: clearPendingFiles,
  } = usePendingFiles();

  const { isConnected, send } = useWebSocket({
    currentUser,
    activeRoomIdRef,
    onMessage: (data) => {
      if (data.__read) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.message_id ? { ...msg, is_read: 1 } : msg
          )
        );
        return;
      }
      setMessages((prev) => [...prev, data]);
    },
    onUnreadIncrement: incrementForUser,
    onStatus: ({ userId, isOnline }) => {
      setOnlineUsers((prev) =>
        isOnline
          ? prev.includes(userId)
            ? prev
            : [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    },
  });

  useAutoScroll(chatRef, [messages]);

  const { openRoom } = useChatRooms({ currentUser, activeRoomIdRef });

  const handleClientClick = async (userId, name) => {
    await openRoom({
      userId,
      name,
      onOpen: ({ roomId, chatId, chatName }) => {
        setActiveRoomId(roomId);
        setActiveChatId(chatId);
        setActiveChatName(chatName);
        setMessages([]);
        clearForUser(userId);
      },
      onLoaded: (normalized) => setMessages(normalized),
    });

    if (activeRoomIdRef.current) {
      send({
        type: 'mark_all_read',
        room_id: activeRoomIdRef.current,
        user_id: currentUser.id,
      });
    }
  };

  const sendMessage = (text) => {
    if (!activeRoomId) {
      alert('Сначала выберите собеседника слева!');
      return;
    }
    const ok = send({
      type: 'message',
      text,
      from: currentUser.id,
      room_id: activeRoomId,
    });
    if (!ok) alert('Сервер не подключен!');
  };

  const sendImages = async (text = '') => {
  if (!activeRoomId) return;
  if (pendingFiles.length === 0 && !text.trim()) return;

  setIsUploading(true);

  const media = [];
  for (const file of pendingFiles) {
    try {
      const data = await uploadImage(file); // возвращает { path, type, mime, name, size }
      if (data) media.push(data);
    } catch (err) {
      console.error('Ошибка загрузки файла:', file.name, err);
      // Можно либо прервать всю отправку, либо продолжить с остальными файлами — как удобнее
    }
  }

  setIsUploading(false);
  clearPendingFiles();

  // ВАЖНО: тип должен совпадать с Chat.php: media_batch_with_text
  const ok = send({
    type: 'media_batch_with_text',
    room_id: activeRoomIdRef.current,
    media: media,
    text: text.trim(),
  });

  if (!ok) alert('Нет соединения с чатом');
};


  return (
    <div className="main">
      <Sidebar
        onLogout={onLogout}
        users={users}
        onlineUsers={onlineUsers}
        currentUser={currentUser}
        onClientClick={handleClientClick}
        activeChatId={activeChatId}
        unreadCounts={unreadCounts}

      />

      <div className="main_big">
        <ChatHeader
          title={activeRoomId ? activeChatName : 'Выберите собеседника'}
          isConnected={isConnected}
        />

        <MessageList
          messages={messages}
          currentUser={currentUser}
          chatRef={chatRef}
          isConnected={isConnected}
          unreadCounts={unreadCounts}
          sizeImage={sizeImage}
        />

        {activeRoomId && (
          <MessageInput
            onSend={sendMessage}
            onImageSelect={handleImageSelect}
            onImageSend={sendImages}
            onImageCancel={handleImageCancel}
            onRemoveSingleFile={handleRemoveSingleFile}
            pendingFiles={pendingFiles}
            isUploading={isUploading}
          />
        )}

        {!activeRoomId && (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            Нажмите на пользователя слева, чтобы начать приватный чат
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;