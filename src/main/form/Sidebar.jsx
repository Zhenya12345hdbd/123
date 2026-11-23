import { useState } from 'react';
import '../main.css';
import settings from '../image/settings.png';
import userPlaceholder from '../image/photo_user.avif';
import { deleteAccount } from '../api/users';
import UserCard from './userCard';
import GroupCard from './group_card';

function Sidebar({
  onLogout,
  onlineUsers,
  currentUser,
  onClientClick,
  activeChatId,
  activeChatIsGroup, // опционально, если передаёте из родителя
  unreadCounts,
  friends = [],
  isLoadingFriends,
  onRemoveFriend,
  onCreateGroup,
  groups = [],
  isLoadingGroups,
  onLeaveGroup,
  onDeleteGroup
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      'Вы уверены, что хотите удалить аккаунт? Вся ваша переписка будет безвозвратно удалена.'
    );
    if (!isConfirmed) return;

    try {
      await deleteAccount();
      localStorage.removeItem('chat_user');
      localStorage.removeItem('chat_token');
      if (onLogout) onLogout();
    } catch (err) {
      console.error(err);
      alert('Не удалось удалить аккаунт. Попробуйте позже.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/logout.php', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('chat_user');
    localStorage.removeItem('chat_token');
    onLogout?.();
  };
 const filteredList = groups.filter((item) =>
    item.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. Объединяем группы и друзей в один массив
  

  return (
    <div className="main_small">
      <div className="main_small_tags">
        <h1>Friends list <span className="tag_list">∧</span></h1>
        <img src={settings} alt="Settings" />
      </div>

      <div className="user_card">
        <img
          src={currentUser.avatar_path || userPlaceholder}
          className="main_user_card"
          alt="Current User"
        />
        <div className="user_name">
          <p className="name_full">{currentUser.first_name} {currentUser.last_name}</p>
          <button onClick={handleLogout} className="button_exit">Выйти</button>
          <button onClick={handleDeleteAccount} className="button_delete_account">Удалить аккаунт</button>
        </div>
      </div>

      <div className="friends">
        <div className="friends_num">
          <h1>Chats ({groups.length})</h1>
          <button onClick={onCreateGroup} className="add_group_btn">+</button>
        </div>

        <div className="search_user_div">
          <input
            type="text"
            className="search_user_input"
            placeholder="Поиск по чатам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="list">
          {isLoadingGroups || isLoadingFriends ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Загрузка...</p>
          ) : filteredList.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', fontSize: 12 }}>
              {searchTerm ? 'Не найдено' : 'Нет чатов'}
            </p>
          ) : (
            filteredList.map((item) => {
              // Проверяем совпадение ID и типа чата (если activeChatIsGroup передан)
              const isSameId = String(item.id) === String(activeChatId);
              const isActive = activeChatIsGroup !== undefined
                ? isSameId && item.isGroup === activeChatIsGroup
                : isSameId;

              if (item.isGroup) {
                const unreadCount = unreadCounts[`group_${item.id}`] || 0;
                return (
                  <GroupCard
                    key={item.uniqueKey}
                    group={item}
                    isActive={isActive}
                    unreadCount={unreadCount}
                    onClientClick={onClientClick}
                     onDeleteGroup={onDeleteGroup}
                      onLeaveGroup={onLeaveGroup}
                      currentUserId={currentUser?.id}
                  />
                );
              }

              const isUserOnline = onlineUsers.some((id) => String(id) === String(item.id));
              const count = unreadCounts[item.id] || 0;

              return (
                <UserCard
                  key={item.uniqueKey}
                  u={item}
                  isUserOnline={isUserOnline}
                  isActive={isActive}
                  count={count}
                  onClientClick={onClientClick}
                  onRemoveFriend={onRemoveFriend}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
