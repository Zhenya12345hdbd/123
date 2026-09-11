import './main.css';
import user from './photo_user.avif';
import { useEffect, useRef } from 'react';

function MessageList({ messages, currentUser, chatRef, isConnected }) {
 

  return (
    <div ref={chatRef} className="message_area">
      {messages.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
          {isConnected ? 'Начните чат!' : 'Подключение...'}
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMyMessage = currentUser && msg.user_id === currentUser.id;
          const shouldBlink = isMyMessage && index === messages.length - 1;
          // Мигаем только последнее сообщение
         

          return (
            <div
              key={index}
             className={`message ${isMyMessage ? 'message-right' : 'message-left'} ${shouldBlink ? 'message-new' : ''}`}
            >
              {!isMyMessage && (
                <img src={user} className="photo_user" alt="User" />
              )}

              <div className="message_user">
                <div className="user_date">
                  <h2 className="name_user">{msg.username}</h2>
                  <h4>{msg.time}</h4>
                </div>
                <p className="text_message">{msg.text}</p>
              </div>

              {isMyMessage && (
                <img src={user} className="photo_user photo-self" alt="Me" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MessageList;
