import './main.css';
import { useRef, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';


function Main({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const chatRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('chat_user') || 'null');

  // === ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ ===
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const url = `get_users.php?t=${Date.now()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP: ${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
      }
    };
    loadUsers();
  }, []);

  // === WEBSOCKET ===
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8081');
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      if (currentUser) {
        socket.send(JSON.stringify({
          type: 'auth',
          user_id: currentUser.id,
        }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
          setMessages((prev) => [...prev, data]);
        } else if (data.type === 'user_status') {
          if (data.is_online) {
            setOnlineUsers((prev) =>
              !prev.includes(data.user_id) ? [...prev, data.user_id] : prev
            );
          } else {
            setOnlineUsers((prev) => prev.filter((id) => id !== data.user_id));
          }
        } else if (data.type === 'auth_ok') {
          console.log('Авторизация подтверждена:', data.username);
        } else if (data.type === 'auth_error' || data.type === 'error') {
          console.error('Ошибка:', data.error || data.text);
        }
      } catch (e) {
        console.error('Ошибка парсинга:', e);
      }
    };

    socket.onclose = () => setIsConnected(false);
    socket.onerror = (error) => console.error('WebSocket Error:', error);

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // === АВТО-ПРОКРУТКА ===
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
      socket.send(JSON.stringify({ text }));
    } else {
      alert('Сервер не подключен!');
    }
  };

  return (
    <div className="main">
      <Sidebar
        onLogout={onLogout}
        users={users}
        onlineUsers={onlineUsers}
      />

      <div className="main_big">
        <ChatHeader />
        <MessageList
          messages={messages}
          currentUser={currentUser}
          chatRef={chatRef}
          isConnected={isConnected}
        />

        
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}

export default Main;
