import './main.css';
import { useRef, useState, useMemo, useEffect } from 'react';
import ForwardModal from './form/ForwardModal';
import CreateGroupModal from './form/CreateGroupModal';

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
import { fetchFriendRequests } from './api/users';
import { uploadImage } from './api/upload';
import { useGroups } from './hooks/useGroups';


function Main({ onLogout }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]); // <-- Заявки в друзья

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatName, setActiveChatName] = useState('');
  const [messageToForward, setMessageToForward] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const chatRef = useRef(null);
  const activeRoomIdRef = useRef(null);

  const currentUser = useMemo(
    () => JSON.parse(localStorage.getItem('chat_user') || 'null'),
    []
  );

  const { friends, isLoading: isLoadingFriends, loadFriends } = useFriends(currentUser);
  const { users, searchResults, isSearching, search, clearSearch } = useUsers();
  const { unreadCounts, clearForUser, incrementForUser } = useUnreadCounts(currentUser);

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
    removeMessage,
    loadOlder,
  } = useChatHistory(currentUser);
  const { groups, loadGroups, isLoadingGroups } = useGroups(currentUser);
 



  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchFriendRequests();
        setFriendRequests(data);
      } catch (err) {
        console.error('Ошибка загрузки заявок:', err);
      }
    };
    if (currentUser) {
      loadRequests();
    }
  }, [currentUser]);
  const { isConnected, send } = useWebSocket({
    currentUser,
    activeRoomIdRef,
    onMessage: (data) => {
      if (data.__read) {
        patchMessage(data.message_id, { is_read: 1 });
        return;
      }
       if (data.type === 'message_deleted') {
        removeMessage(data.message_id);
    return; 
  }

      appendMessage(data);
    },
    onUnreadIncrement: incrementForUser,
    onStatus: ({ userId, isOnline }) => {
      setOnlineUsers((prev) =>
        isOnline
          ? prev.includes(userId) ? prev : [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    },
    // 2. ДОБАВЛЯЕМ КОЛБЭКИ ДЛЯ ДРУЗЕЙ
    onNewRequest: (data) => {
      setFriendRequests((prev) => [...prev, data]);
    },
    onRequestHandled: (data) => {
  if (data.action === 'accept') {
    loadFriends(); 
    alert('Ваша заявка в друзья принята!');
  } else {
    alert('Ваша заявка отклонена');
  }
},

onFriendListUpdated: () => {
  console.log('Сервер сообщил об обновлении списка друзей (для того, кто принял)');
  loadFriends(); // Перезапрашиваем друзей
}
    
  });

  // 3. Теперь sendFriendRequest может использовать send
  const sendFriendRequest = (targetId) => {
    send({ type: 'send_request', target_id: targetId });
  };
  const handleRemoveFriend = (friendId) => {
  send({ type: 'remove_friend', target_id: friendId });
};
const handleDeleteMessage = (msgId) => {
  if (window.confirm('Удалить это сообщение?')) {
    send({ type: 'delete_message', message_id: msgId });
  }
};

  const handleRequestAction = (requestId, action) => {
    send({ type: 'handle_request', request_id: requestId, action });
    // Убираем заявку из локального состояния
    setFriendRequests(prev => prev.filter(r => r.request_id !== requestId));
  };

  const { openRoom } = useChatRooms({ currentUser, activeRoomIdRef });

 const handleClientClick = async (userId, name, isGroup = false) => {
    await openRoom({
      userId,
      name,
      isGroup,
      onOpen: ({ roomId, chatId, chatName }) => {
        setActiveRoomId(roomId);
        setActiveChatId(chatId);
        setActiveChatName(chatName);
        setRoomId(roomId);
        clearForUser(isGroup ? `group_${userId}` : userId);
      },
      onLoaded: (msgs, more) => setInitial(msgs, more),
    });

    if (activeRoomIdRef.current) {
      send({
        type: 'mark_all_read',
        room_id: activeRoomIdRef.current,
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
  const handleForwardToFriend = (friendId) => {
  if (!messageToForward) return;

  // Отправляем через WebSocket
  send({ 
    type: 'forward_message', 
    target_user_id: friendId, 
    original_message: messageToForward 
  });

  setMessageToForward(null); // Закрываем модалку
  alert('Сообщение переслано!');
};
 const handleOpenForward = (msg) => {
  setMessageToForward(msg);
};
const handleCreateGroup = async (name, memberIds) => {
  try {
    const res = await fetch('create_group.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, members: memberIds })
    });
    const data = await res.json();
    if (data.success) {
      setShowCreateGroup(false);
      loadGroups();
      alert('Группа создана!');
      // Тут можно сразу открыть новую группу: handleClientClick(data.room_id, name)
    }
  } catch (err) {
    console.error(err);
  }
};
const combinedList = [
    ...groups.map((g) => ({
      ...g,
      isGroup: true,
      displayName: g.name,
      uniqueKey: `group_${g.id}`,
    })),
    ...friends.map((u) => ({
      ...u,
      isGroup: false,
      displayName: `${u.first_name} ${u.last_name}`,
      uniqueKey: `user_${u.id}`,
    })),
  ];

  // 2. Поиск по общему списку
 
  // 3. Сортировка: группы -> онлайн-друзья -> остальные по алфавиту
  const sortedList = [...combinedList].sort((a, b) => {
    if (a.isGroup !== b.isGroup) return a.isGroup ? -1 : 1;

    if (!a.isGroup && !b.isGroup) {
      const aOnline = onlineUsers.some((id) => String(id) === String(a.id));
      const bOnline = onlineUsers.some((id) => String(id) === String(b.id));
      if (aOnline !== bOnline) return aOnline ? -1 : 1;
    }

    return a.displayName.localeCompare(b.displayName, 'ru');
  });


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
        onRemoveFriend={handleRemoveFriend}
        onCreateGroup={() => setShowCreateGroup(true)}
        groups={sortedList}
        isLoadingGroups={isLoadingGroups}
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
          onSendRequest={sendFriendRequest}
          friendRequests={friendRequests}
     onHandleRequest={handleRequestAction}
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
          onForwardMessage={handleOpenForward}
          onDeleteMessage={handleDeleteMessage}
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
            {messageToForward && (
      <ForwardModal
        friends={sortedList}
        onClose={() => setMessageToForward(null)}
        onForward={handleForwardToFriend}
      />
    )}

        {!activeRoomId && (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            Нажмите на пользователя слева, чтобы начать приватный чат
          </div>
        )}

         {showCreateGroup && (
        <CreateGroupModal 
          friends={friends} 
          onClose={() => setShowCreateGroup(false)} 
          onCreate={handleCreateGroup} 
        />
      )}
      </div>
    </div>
  );
}

export default Main;