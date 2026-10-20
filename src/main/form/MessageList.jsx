import React, { useState, useRef, useLayoutEffect } from 'react';
import '../main.css';
import user from '../image/photo_user.avif';
import ImageGrid from './image_block';

function MessageList({
  messages,
  currentUser,
  chatRef,
  isConnected,
  hasMore,
  isLoadingMore,
  onLoadOlder,
}) {
  const [zoomedMedia, setZoomedMedia] = useState(null);

  // --- Скролл: сохранение позиции при подгрузке старых ---
  const prevHeightRef = useRef(0);
  const prevFirstIdRef = useRef(null);

  // --- Скролл: автоскролл вниз при новых ---
  const prevLastIdRef = useRef(null);
  const prevCountRef = useRef(0);
  const firstRunRef = useRef(true);

  const handleMediaClick = (item) => setZoomedMedia(item);

  // Восстановление позиции при добавлении старых (первый id уменьшился)
  useLayoutEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const firstId = messages[0]?.id ?? null;

    if (
      prevFirstIdRef.current !== null &&
      firstId !== null &&
      prevFirstIdRef.current !== null &&
      firstId !== prevFirstIdRef.current &&
      prevHeightRef.current > 0 &&
      // добавление старых: новый первый id МЕНЬШЕ прежнего
      Number(firstId) < Number(prevFirstIdRef.current)
    ) {
      const delta = el.scrollHeight - prevHeightRef.current;
      if (delta > 0) el.scrollTop += delta;
    }

    prevFirstIdRef.current = firstId;
    prevHeightRef.current = el.scrollHeight;
  }, [messages, chatRef]);

  // Автоскролл вниз при новых сообщениях
  useLayoutEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const lastId = messages[messages.length - 1]?.id ?? null;
    const count = messages.length;

    if (firstRunRef.current && count > 0) {
      el.scrollTop = el.scrollHeight;
      firstRunRef.current = false;
    } else if (
      prevLastIdRef.current !== null &&
      lastId !== null &&
      Number(lastId) > Number(prevLastIdRef.current) &&
      count > prevCountRef.current
    ) {
      // новое сообщение добавилось в конец — скроллим вниз
      el.scrollTop = el.scrollHeight;
    }

    prevLastIdRef.current = lastId;
    prevCountRef.current = count;
  }, [messages, chatRef]);

  // Сброс при смене комнаты (когда messages стал пустым)
  useLayoutEffect(() => {
    if (messages.length === 0) {
      firstRunRef.current = true;
      prevFirstIdRef.current = null;
      prevLastIdRef.current = null;
      prevHeightRef.current = 0;
      prevCountRef.current = 0;
    }
  }, [messages.length]);

  const handleScroll = () => {
    const el = chatRef.current;
    if (!el) return;
    if (el.scrollTop < 60 && hasMore && !isLoadingMore) {
      onLoadOlder?.();
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <div ref={chatRef} className="message_area" onScroll={handleScroll}>
        <div className="messages">
          {isLoadingMore && (
            <div style={{ textAlign: 'center', color: '#888', padding: '8px' }}>
              Загрузка истории...
            </div>
          )}

          {!hasMore && messages.length > 0 && (
            <div
              style={{
                textAlign: 'center',
                color: '#aaa',
                padding: '8px',
                fontSize: 12,
              }}
            >
              Начало переписки
            </div>
          )}

          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
              {isConnected ? 'Начните чат!' : 'Подключение...'}
            </div>
          ) : (
            messages.map((msg) => {
              const msgId = msg.id ?? Math.random().toString();
              const isMyMessage = String(msg.from) === String(currentUser.id);
              const isSystem = msg.type === 'system';

              const hasMedia =
                msg.type === 'file_batch_with_text' &&
                Array.isArray(msg.file_paths) &&
                msg.file_paths.length > 0;

              const hasText = msg.text && msg.text.trim() !== '';

              return (
                <div
                  key={msgId}
                  className={`${isSystem ? 'system_message' : 'message'} ${
                    isMyMessage ? 'message-right' : 'message-left'
                  }`}
                >
                  {!isMyMessage && !isSystem && (
                    <img
                      src={msg.avatar_path || user}
                      alt="User"
                      className="photo_user"
                    />
                  )}

                  <div className="message_user">
                    <div
                      className={`user_date ${
                        isMyMessage ? 'user_date_right' : 'user_date_left'
                      }`}
                    >
                      {!isSystem && (
                        <div>
                          <h2 className="name_user">
                            {msg.username || 'Пользователь'}
                          </h2>
                          <h4>{msg.time || '00:00'}</h4>
                        </div>
                      )}
                    </div>

                    <div className="text_with_arrow">
                      {hasMedia && (
                        <ImageGrid
                          media={msg.file_paths}
                          onMediaClick={handleMediaClick}
                        />
                      )}

                      {hasText && <p className="text_message">{msg.text}</p>}

                      {isMyMessage && (
                        <div className="message_arrow arrow-4">
                          <span
                            className={`arrow-4-right ${
                              msg.is_read === 1 ? 'arrow-4-right_change_color' : ''
                            }`}
                          ></span>
                          <span
                            className={`arrow-4-right arrow-4-right_second ${
                              msg.is_read === 1 ? 'arrow-4-right_change_color' : ''
                            }`}
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

      {zoomedMedia && (
        <div className="zoom" onClick={() => setZoomedMedia(null)}>
          {zoomedMedia.type === 'videos' ? (
            <video
              className="zoomed_video"
              src={zoomedMedia.path}
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
            />
          ) : zoomedMedia.type === 'audio' ? (
            <div className="zoomed_audio" onClick={(e) => e.stopPropagation()}>
              <p>{zoomedMedia.name || 'Аудио'}</p>
              <audio src={zoomedMedia.path} controls autoPlay />
            </div>
          ) : zoomedMedia.type === 'images' ? (
            <img
              className="zoomed_img"
              src={zoomedMedia.path}
              alt="Zoomed"
              onClick={(e) => e.stopPropagation()}
            />
          ) : zoomedMedia.type === 'files' ? (
            <div className="zoomed_file" onClick={(e) => e.stopPropagation()}>
              <p>{zoomedMedia.name || 'Файл'}</p>
              <a href={zoomedMedia.path} download className="btn_download">
                Скачать
              </a>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

export default MessageList;