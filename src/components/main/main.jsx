import './main.css';
import ings from './settings.png';
import user from './photo_user.avif';
import star from './star.png';
import peoople from './peoople.png';
import found from './found.png';
import ding from './ding.png';
import three from './three.png';
import voice from './voice.png';
import smile from './smile.png';
import file from './file.png';
import { useRef, useState, useEffect } from 'react';

function Main({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);

  const socketRef = useRef(null);
  const chatRef = useRef(null);

  // Читаем текущего пользователя из localStorage
  const currentUser = JSON.parse(localStorage.getItem('chat_user') || 'null');

  // === ЛОГИКА ЗАГРУЗКИ ПОЛЬЗОВАТЕЛЕЙ (ТОЛЬКО ИЗ БД) ===
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // ВАЖНО: Добавляем timestamp, чтобы браузер НЕ брал ответ из кэша.
        // Это гарантирует, что мы получим список, включающий только что зарегистрированного пользователя.
        const url = `get_users.php?t=${Date.now()}`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        console.log('Список пользователей загружен из БД:', data);
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
      }
    };

    loadUsers();
  }, []); // Запускается только один раз при монтировании компонента Main

  // === WEBSOCKET ЛОГИКА ===
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8081');
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        console.error('Ошибка парсинга сообщения:', e);
      }
    };
    socket.onclose = () => setIsConnected(false);
    socket.onerror = (error) => console.error('WebSocket Error:', error);

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // === АВТО-ПРОКРУТКА ЧАТА ===
  useEffect(() => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 0);
    }
  }, [messages]);

  const sendMessage = (text) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({
        name: currentUser ? currentUser.username : 'Гость',
        text: text,
      });
      socket.send(payload);
    } else {
      alert('Сервер не подключен!');
    }
  };

  return (
    <div className="main">
      {/* ЛЕВАЯ ПАНЕЛЬ (СПИСОК ПОЛЬЗОВАТЕЛЕЙ) */}
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
              users.map((u) => (
                <div key={u.id} className="user_page">
                  {/* Статус онлайн/оффлайн (упрощенно по состоянию сокета) */}
                  <div className={`tochka ${isConnected ? 'online' : 'offline'}`}></div>
                  
                  <img src={user} className="photo_user" alt="" />
                  <div className="user_info">
                    <p className="name_full">{u.first_name} {u.last_name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ (ЧАТ) */}
      <div className="main_big">
        {/* ... блок search_line (оставь как был) ... */}
        <div className="search_line">
           <div className="search">
             <div className="tag_now">
               <h1>#general</h1>
               <img src={star} className="small_img" alt="Star" />
             </div>
             <div className="num">
               <img src={peoople} className="small_img" alt="People" />
               <h3>1,093</h3>
             </div>
           </div>
           {/* Остальные элементы search_input оставь без изменений */}
           <div className="search_input">
             <form>
               <input type="text" className="input_top" placeholder="Search..." />
               <button className="search_button">
                 <img src={found} className="small_img found" alt="Find" />
               </button>
             </form>
             <img src={ding} alt="Ding" className="small_img pointer" />
             <div className="red_point red_point_ding"></div>
             <img src={three} alt="Three dots" className="small_img pointer" />
             <div className="red_point red_point_three"></div>
           </div>
         </div>

        {/* ОБЛАСТЬ СООБЩЕНИЙ */}
        <div ref={chatRef} className="message_area">
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
              {isConnected ? 'Начните чат!' : 'Подключение...'}
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="message">
                <img src={user} className="photo_user" alt="User" />
                <div className="message_user">
                  <div className="user_date">
                    <h2 className="name_user">{msg.username}</h2>
                    <h4>{msg.time}</h4>
                  </div>
                  <p className="text_message">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* НИЖНЯЯ ПАНЕЛЬ (ВВОД) */}
        <div className="footer_input">
          <img src={file} className="footer_img pointer" alt="File" />
          <img src={voice} className="footer_img pointer" alt="Voice" />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const textarea = e.target.querySelector('textarea');
              const text = textarea.value.trim();
              if (text) {
                sendMessage(text);
                textarea.value = '';
              }
            }}
          >
            <textarea
              className="main_form"
              placeholder="Напиши сообщение..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const text = e.target.value.trim();
                  if (text) {
                    sendMessage(text);
                    e.target.value = '';
                  }
                }
              }}
            ></textarea>
          </form>
          <img src={smile} className="smile pointer" alt="Smile" />
        </div>
      </div>
    </div>
  );
}

export default Main;
