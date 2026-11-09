import { useState } from 'react';
import '../main.css';
import settings from '../image/settings.png';
import userPlaceholder from '../image/photo_user.avif';
import { deleteAccount } from '../api/users';
import UserCard from './userCard';

function Sidebar({
  onLogout,
  onlineUsers,
  currentUser,
  onClientClick,
  activeChatId,
  unreadCounts,
  friends = [],
  isLoadingFriends,
  onRemoveFriend,
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

  const filteredFriends = friends.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const sortedFriends = [...filteredFriends].sort((a, b) => {
    const aOnline = onlineUsers.some((id) => String(id) === String(a.id));
    const bOnline = onlineUsers.some((id) => String(id) === String(b.id));
    if (aOnline !== bOnline) return aOnline ? -1 : 1;
    const aName = `${a.first_name} ${a.last_name}`.toLowerCase();
    const bName = `${b.first_name} ${b.last_name}`.toLowerCase();
    return aName.localeCompare(bName, 'ru');
  });

  const handleLogout = async () => {
    try { await fetch('/logout.php', { method: 'POST' }); } catch (e) { console.error(e); }
    localStorage.removeItem('chat_user');
    localStorage.removeItem('chat_token');
    onLogout?.();
  };

  return (
    <div className="main_small">
      <div className="main_small_tags">
        <h1>Friends list <span className="tag_list">&#8743;</span></h1>
        <img src={settings} alt="Settings" />
      </div>

      <div className="user_card">
        <img src={currentUser.avatar_path || userPlaceholder} className="main_user_card" alt="Current User" />
        <div className="user_name">
          <p className="name_full">{currentUser.first_name} {currentUser.last_name}</p>
          <button onClick={handleLogout} className="button_exit">Выйти</button>
          <button onClick={handleDeleteAccount} className="button_delete_account">Удалить аккаунт</button>
        </div>
      </div>

      <div className="friends">
        <div className="friends_num">
          <h1>Friends</h1>
          <h1>{friends.length}</h1>
        </div>

        <div className="search_user_div">
          <input
            type="text"
            className="search_user_input"
            placeholder="Поиск по друзьям..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="list">
          {isLoadingFriends ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Загрузка...</p>
          ) : sortedFriends.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', fontSize: 12 }}>
              {searchTerm ? 'Не найдено' : 'Нет друзей'}
            </p>
          ) : (
            sortedFriends.map((u) => {
              const isUserOnline = onlineUsers.some((id) => String(id) === String(u.id));
              const isActive = String(u.id) === String(activeChatId);
              const count = unreadCounts[u.id] || 0;

              // Используем наш отдельный компонент
              return (
                <UserCard
                  key={u.id}
                  u={u}
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