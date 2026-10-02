import '../main.css';
import { useState } from 'react';
import user from '../image/photo_user.avif';

function MessageList({ messages, currentUser, chatRef, isConnected }) {
  const [zoomedSrc, setZoomedSrc] = useState(null);
  if (!currentUser) return null;

  // храним путь картинки, которая сейчас увеличена (null = ничего не увеличено)


  const amplyImage = (path) => {
    // если кликнули по той же картинке — закрываем, иначе открываем новую
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
              const isMyMessage = String(msg.from) === String(currentUser.id);
              const isSystem = msg.type === 'system';

              const hasImages =
                (msg.type === 'image_batch' || msg.type === 'image_batch_with_text') &&
                msg.image_paths && msg.image_paths.length > 0;

              const hasText = msg.text && msg.text.trim() !== '';
              const isSingleImage = msg.type === 'image' || (msg.image_path && !msg.text);

              return (
                <div
                  key={msg.id}
                  className={`${isSystem ? 'system_message' : 'message'} ${isMyMessage ? 'message-right' : 'message-left'}`}
                >
                  {!isMyMessage && !isSystem && (
                    <img src={msg.avatar_path || user} alt="User" className="photo_user" />
                  )}

                  <div className="message_user">
                    <div className={`user_date ${isMyMessage ? 'user_date_right' : 'user_date_left'}`}>
                      {!isSystem && (
                        <>
                          <h2 className="name_user">{msg.username}</h2>
                          <h4>{msg.time}</h4>
                        </>
                      )}
                    </div>

                    <div className='text_with_arrow'>
                              {hasImages && (() => {
            const n = msg.image_paths.length;
            const countClass =
              n === 1 ? 'count-1' :
              n % 2 === 1 ? 'count-odd' :
              'count-even';

            return (
              <div className={`div_all_image ${countClass}`}>
                {msg.image_paths.map((path, idx) => (
                  <img
                    className='img_in_message_much'
                    key={idx}
                    src={path}
                    alt={`image-${idx}`}
                    onClick={() => amplyImage(path)}
                  />
                ))}
              </div>
            );
          })()}

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
                    <img src={msg.avatar_path || user} className="photo_user photo-self" alt="Me" />
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
              e.stopPropagation(); // клик по самой картинке — не закрывать сразу
              setZoomedSrc(null);  // но при повторном клике — закрыть
            }}
          
          />
        </div>
      )}
    </>
  );
}

export default MessageList;