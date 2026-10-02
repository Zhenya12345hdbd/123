import '../main.css';
import settings from '../image/settings.png';
// Убедись, что пути к картинкам верные. Если photo_user.avif нет, используй заглушку или удали эту строку
import userPlaceholder from '../image/photo_user.avif'; 

function Sidebar({ onLogout, users, onlineUsers, currentUser, onClientClick, activeChatId, unreadCounts }) {
  const withoutMe = users.filter(
    user => String(user.id) !== String(currentUser?.id)
  );

  return (
    <div className="main_small">
      <div className="main_small_tags">
        <h1>Friends list <span className="tag_list">&#8743;</span></h1>
        <img src={settings} alt="Settings" />
      </div>

      <div className="user_card">
        {/* Добавь проверку на наличие аватара, чтобы не было битой картинки */}
        <img 
          src={currentUser.avatar_path || userPlaceholder} 
          className="main_user_card" 
          alt="Current User" 
          
        />
        <div className="user_name">
          <p className="name_full">
            {currentUser.first_name} {currentUser.last_name}
          </p>
          <button onClick={onLogout} className="button_exit">
            Выйти
          </button>
        </div>
      </div>

      <div className="friends">
        <div className="friends_num">
          <h1>Users</h1>
          <h1>{users.length}</h1>
        </div>

        <div className="list">
          {users.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Загрузка...</p>
          ) : (
            withoutMe.map((u) => {
              const isUserOnline = onlineUsers.some(id => String(id) === String(u.id));
              const isActive = String(u.id) === String(activeChatId);
              
              // Получаем количество непрочитанных для этого пользователя
              const count = unreadCounts[u.id] || 0;
              
              // ГЛАВНОЕ ИСПРАВЛЕНИЕ: onClick здесь!
              return (
                <div 
                  key={u.id} 
                  className="user_page"
                  onClick={() => onClientClick(u.id, `${u.first_name} ${u.last_name}`)}
                  style={{ cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
                >
                  <div className={`tochka ${isUserOnline ? 'online' : 'offline'}`}>
                  </div>
                  
                  <img 
                    src={u.avatar_path || userPlaceholder} 
                    className="photo_user" 
                    alt={`${u.first_name}`} 
                  />
                  
                  <div className="user_info">
                    <p className="name_full">{u.first_name} {u.last_name}</p> <div className='entered_message'>{count > 0 ? count : ''}</div>
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
