import { useState, useEffect } from 'react';
import '../main.css';
import settings from '../image/settings.png';
import userPlaceholder from '../image/photo_user.avif';
import { fetchFriends, removeFriend } from '../api/users';
import delet from '../image/delete.png'

function Sidebar({
  onLogout,
  onlineUsers,
  currentUser,
  onClientClick,
  activeChatId,
  unreadCounts,
}) {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем друзей при монтировании
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchFriends();
        if (!cancelled) setFriends(data);
      } catch (err) {
        console.error('Ошибка загрузки друзей:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleRemoveFriend = async (e, friendId, first_name, last_name ) => {
    e.stopPropagation(); // Чтобы клик по крестику не открывал чат
    
    if (!window.confirm(`удалить ${first_name} ${last_name} из друзей?`)) return;

    // Оптимистичное обновление: убираем из UI сразу
    setFriends(prev => prev.filter(f => f.id !== friendId));

    try {
      await removeFriend(friendId);
    } catch (err) {
      console.error('Ошибка удаления друга:', err);
      alert('Не удалось удалить друга');
      // Если ошибка, возвращаем обратно (загружаем заново)
      try {
        const data = await fetchFriends();
        setFriends(data);
      } catch (e) {}
    }
  };

  // Локальный поиск по друзьям (быстрый)
  const filteredFriends = friends.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Сортировка (онлайн сверху)
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
          {isLoading ? (
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

              return (
                <div
                  key={u.id}
                  className={`user_page ${isActive ? 'user_page_active' : ''}`}
                >
                  <div className={`tochka ${isUserOnline ? 'online' : 'offline'}`} />
                  <img src={u.avatar_path || userPlaceholder} className="photo_user" alt={u.first_name} />
                  <div className="user_info">
                    <p className="name_full" onClick={() => onClientClick(u.id, `${u.first_name} ${u.last_name}`)}>{u.first_name} {u.last_name}</p>
                    <div className='delete'><img src={delet} onClick={(e) => handleRemoveFriend(e, u.id, u.first_name, u.last_name)}/></div>
                    <div className="entered_message">{count > 0 ? count : ''}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;