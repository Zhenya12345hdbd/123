import '../main.css';
import { useState } from 'react';
import user from '../image/photo_user.avif';
import ImageGrid from './image_block';

function MessageList({ messages, currentUser, chatRef, isConnected }) {
  const [zoomedSrc, setZoomedSrc] = useState(null);

  if (!currentUser) return null;

  const handleImageClick = (path) => {
    setZoomedSrc((prev) => (prev === path ? null : path));
  };

  return (
    <>
      <div ref={chatRef} className="message_area">
        <div className="messages">
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
              {isConnected ? 'Начните чат!' : 'Подключение...'}
            </div>
          ) : (
            messages.map((msg) => {
              // Защита от отсутствия id
              const msgId = msg.id ?? Math.random().toString();
              const isMyMessage = String(msg.from) === String(currentUser.id);
              const isSystem = msg.type === 'system';

              const hasImages =
                (msg.type === 'image_batch' || msg.type === 'image_batch_with_text') &&
                Array.isArray(msg.image_paths) &&
                msg.image_paths.length > 0;

              const hasText = msg.text && msg.text.trim() !== '';

              return (
                <div
                  key={msgId}
                  className={`${isSystem ? 'system_message' : 'message'} ${isMyMessage ? 'message-right' : 'message-left'}`}
                >
                  {!isMyMessage && !isSystem && (
                    <img
                      src={msg.avatar_path || user}
                      alt="User"
                      className="photo_user"
                    />
                  )}

                  <div className="message_user">
                    <div className={`user_date ${isMyMessage ? 'user_date_right' : 'user_date_left'}`}>
                      {!isSystem && (
                        <>
                          <h2 className="name_user">{msg.username || 'Пользователь'}</h2>
                          <h4>{msg.time || '00:00'}</h4>
                        </>
                      )}
                    </div>

                    <div className='text_with_arrow'>
                      {hasImages && (
                        <ImageGrid
                          imagePaths={msg.image_paths}
                          onImageClick={handleImageClick}
                        />
                      )}

                      {hasText && <p className="text_message">{msg.text}</p>}

                      {isMyMessage && (
                        <div className='message_arrow arrow-4'>
                          <span
                            className={`arrow-4-right ${msg.is_read === 1 ? 'arrow-4-right_change_color' : ''}`}
                          ></span>
                          <span
                            className={`arrow-4-right arrow-4-right_second ${msg.is_read === 1 ? 'arrow-4-right_change_color' : ''}`}
                          ></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isMyMessage && (
                    <img
                      src={msg.avatar_path || user}
                      className="photo_user photo-self"
                      alt="Me"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Оверлей с увеличенной картинкой */}
      {zoomedSrc && (
        <div className='zoom' onClick={() => setZoomedSrc(null)}>
          <img
            className='zoomed_img'
            src={zoomedSrc}
            alt="Zoomed"
            onClick={(e) => {
              e.stopPropagation();
              setZoomedSrc(null);
            }}
          />
        </div>
      )}
    </>
  );
}

export default MessageList;
