import React, { useRef } from 'react';
import ImageGrid from './image_block';
import { useLongPress } from '../hooks/useLongPress';
import userPlaceholder from '../image/photo_user.avif';

function MessageItem({ 
  msg, 
  isMyMessage, 
  isSystem, 
  hasMedia, 
  hasText, 
  currentUser, 
  onMediaClick,
  onContextMenu 
}) {
  const messageRef = useRef(null);

  // Хук долгого нажатия
  const longPressProps = useLongPress(
    (e) => {
      // При долгом нажатии получаем координаты курсора/пальца
      const rect = messageRef.current.getBoundingClientRect();
      
      // Позиционируем меню рядом с сообщением
      let x = rect.left;
      let y = rect.bottom + 5;

      // Чтобы меню не улетало за край экрана
      if (x + 150 > window.innerWidth) x = window.innerWidth - 160;
      if (y + 100 > window.innerHeight) y = rect.top - 100;

      onContextMenu(msg, x, y);
    },
    null, // Обычный клик пока не нужен
    { delay: 500 }
  );

  return (
    <div
      ref={messageRef}
      className={`${isSystem ? 'system_message' : 'message'} ${
        isMyMessage ? 'message-right' : 'message-left'
      }`}
      {...longPressProps}
      style={{ userSelect: 'none' }} // Отключаем выделение текста при долгом нажатии
    >
      {!isMyMessage && !isSystem && (
        <img src={msg.avatar_path || userPlaceholder} alt="User" className="photo_user" />
      )}

      <div className={`message_user ${isMyMessage ? 'message_user_right' : 'message_user_left'}`}>
        <div className={`user_date ${isMyMessage ? 'user_date_right' : 'user_date_left'}`}>
          {!isSystem && (
            <div>
              <h2 className="name_user">{msg.username || 'Пользователь'}</h2>
              <h4>{msg.time || '00:00'}</h4>
            </div>
          )}
        </div>

        <div className="text_with_arrow">
          {hasMedia && (
            <ImageGrid media={msg.file_paths} onMediaClick={onMediaClick} />
          )}

          {hasText && <p className="text_message">{msg.text}</p>}

          {isMyMessage && (
            <div className="message_arrow arrow-4">
              <span className={`arrow-4-right ${msg.is_read === 1 ? 'arrow-4-right_change_color' : ''}`}></span>
              <span className={`arrow-4-right arrow-4-right_second ${msg.is_read === 1 ? 'arrow-4-right_change_color' : ''}`}></span>
            </div>
          )}
        </div>
      </div>

      {isMyMessage && (
        <img src={msg.avatar_path || userPlaceholder} className="photo_user photo-self" alt="Me" />
      )}
    </div>
  );
}

export default MessageItem;