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
import { usePendingFiles } from './hooks/usePendingFiles';
import { useChatRooms } from './hooks/useChatRooms';
import { useChatHistory } from './hooks/useChatHistory';
import { useFriends } from './hooks/useFriends';
import { addFriend } from './api/users';

import { uploadImage } from './api/upload';

function Main({ onLogout }) {
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
  const { friends, isLoading: isLoadingFriends, loadFriends } = useFriends(currentUser);
const { users, searchResults, isSearching, search, clearSearch } = useUsers();
  const { unreadCounts, clearForUser, incrementForUser } =
    useUnreadCounts(currentUser);

  const {
    pendingFiles,
    handleImageSelect,
    handleImageCancel,
    handleRemoveSingleFile,
    clear: clearPendingFiles,
  } = usePendingFiles();

  const {
    messages,
    hasMore,
    isLoadingMore,
    setInitial,
    setRoomId,
    appendMessage,
    patchMessage,
    loadOlder,
  } = useChatHistory(currentUser);

  const handleAddFriend = async (friendId, friendName) => {
  try {
    await addFriend(friendId);
    // Перезагружаем список друзей, чтобы Sidebar обновился
    await loadFriends();
    alert(`${friendName} добавлен в друзья!`);
  } catch (err) {
    console.error('Ошибка добавления друга:', err);
    alert('Не удалось добавить друга');
  }
};

  const { isConnected, send } = useWebSocket({
    currentUser,
    activeRoomIdRef,
    onMessage: (data) => {
      if (data.__read) {
        patchMessage(data.message_id, { is_read: 1 });
        return;
      }
      appendMessage(data);
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

  const { openRoom } = useChatRooms({ currentUser, activeRoomIdRef });

  const handleClientClick = async (userId, name) => {
    await openRoom({
      userId,
      name,
      onOpen: ({ roomId, chatId, chatName }) => {
        setActiveRoomId(roomId);
        setActiveChatId(chatId);
        setActiveChatName(chatName);
        setRoomId(roomId);
        clearForUser(userId);
      },
      onLoaded: (msgs, more) => setInitial(msgs, more),
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
      room_id: activeRoomId,
    });
    if (!ok) alert('Сервер не подключен!');
  };

  const sendImages = async (text = '') => {
    if (!activeRoomId) return;
    if (pendingFiles.length === 0 && !text.trim()) return;

    setIsUploading(true);

    const uploaded = [];
    for (const file of pendingFiles) {
      try {
        const data = await uploadImage(file);
        if (data) uploaded.push(data);
      } catch (err) {
        console.error('Ошибка загрузки файла:', file.name, err);
      }
    }

    setIsUploading(false);
    clearPendingFiles();

    if (uploaded.length === 0 && !text.trim()) return;

    const ok = send({
      type: 'file_batch_with_text',
      room_id: activeRoomIdRef.current,
      file_paths: uploaded,
      text: text.trim(),
    });

    if (!ok) alert('Нет соединения с чатом');
  };

  return (
    <div className="main">
      <Sidebar
  onLogout={onLogout}
  onlineUsers={onlineUsers}
  currentUser={currentUser}
  onClientClick={handleClientClick}
  activeChatId={activeChatId}
  unreadCounts={unreadCounts}
  friends={friends}
  loadFriends={loadFriends}
  isLoadingFriends={isLoadingFriends}
/>

      <div className="main_big">
      <ChatHeader
        title={activeRoomId ? activeChatName : 'Выберите собеседника'}
        isConnected={isConnected}
        onSearch={search}
        searchResults={searchResults}
        isSearching={isSearching}
        onClientClick={handleClientClick}
        clearSearch={clearSearch}
        friends={friends}
        onAddFriend={handleAddFriend}
      />

        <MessageList
          messages={messages}
          currentUser={currentUser}
          chatRef={chatRef}
          isConnected={isConnected}
          unreadCounts={unreadCounts}
          sizeImage={sizeImage}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadOlder={loadOlder}
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