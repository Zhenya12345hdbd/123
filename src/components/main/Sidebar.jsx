import './main.css';
import ings from './settings.png';
import user from './photo_user.avif';

function Sidebar({ onLogout, users, onlineUsers }) {
  return (
    <div className="main_small">
      <div className="main_small_tags">
        <h1>Friends list <span className="tag_list">&#8743;</span></h1>
        <img src={ings} alt="Settings" />
        <button
          onClick={onLogout}
          style={{
            marginLeft: 'auto',
            padding: '4px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '4px',
            background: '#ff4757',
            color: '#fff',
          }}
        >
          Выйти
        </button>
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
            users.map((u) => {
              const isUserOnline = onlineUsers.includes(u.id);
              return (
                <div key={u.id} className="user_page">
                  <div className={`tochka ${isUserOnline ? 'online' : 'offline'}`}></div>
                  <img src={user} className="photo_user" alt="" />
                  <div className="user_info">
                    <p className="name_full">{u.first_name} {u.last_name}</p>
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
