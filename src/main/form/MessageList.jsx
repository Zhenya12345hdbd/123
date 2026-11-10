import React, { useState, useRef, useLayoutEffect } from 'react';
import '../main.css';
import MessageItem from './MessageItem';
import MessageContextMenu from './MessageContextMenu';

function MessageList({
  messages, currentUser, chatRef, isConnected, hasMore, isLoadingMore, onLoadOlder,onForwardMessage,
}) {
  const [zoomedMedia, setZoomedMedia] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const prevHeightRef = useRef(0);
  const prevFirstIdRef = useRef(null);
  const prevLastIdRef = useRef(null);
  const prevCountRef = useRef(0);
  const firstRunRef = useRef(true);
  

  const handleMediaClick = (item) => setZoomedMedia(item);

  // (Твои useLayoutEffect для скролла)
  useLayoutEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const firstId = messages[0]?.id ?? null;
    if (prevFirstIdRef.current !== null && firstId !== null && firstId !== prevFirstIdRef.current && prevHeightRef.current > 0 && Number(firstId) < Number(prevFirstIdRef.current)) {
      const delta = el.scrollHeight - prevHeightRef.current;
      if (delta > 0) el.scrollTop += delta;
    }
    prevFirstIdRef.current = firstId;
    prevHeightRef.current = el.scrollHeight;
  }, [messages, chatRef]);

  useLayoutEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const lastId = messages[messages.length - 1]?.id ?? null;
    const count = messages.length;
    if (firstRunRef.current && count > 0) {
      el.scrollTop = el.scrollHeight;
      firstRunRef.current = false;
    } else if (prevLastIdRef.current !== null && lastId !== null && Number(lastId) > Number(prevLastIdRef.current) && count > prevCountRef.current) {
      el.scrollTop = el.scrollHeight;
    }
    prevLastIdRef.current = lastId;
    prevCountRef.current = count;
  }, [messages, chatRef]);

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
          {isLoadingMore && <div style={{ textAlign: 'center', color: '#888', padding: '8px' }}>Загрузка истории...</div>}
          {!hasMore && messages.length > 0 && (
            <div style={{ textAlign: 'center', color: '#aaa', padding: '8px', fontSize: 12 }}>Начало переписки</div>
          )}

          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
              {isConnected ? 'Начните чат!' : 'Подключение...'}
            </div>
          ) : (
            messages.map((msg) => {
              const isMyMessage = String(msg.from) === String(currentUser.id);
              const isSystem = msg.type === 'system';
              const hasMedia = msg.type === 'file_batch_with_text' && Array.isArray(msg.file_paths) && msg.file_paths.length > 0;
              const hasText = msg.text && msg.text.trim() !== '';

              return (
                <MessageItem
                  key={msg.id}
                  msg={msg}
                  isMyMessage={isMyMessage}
                  isSystem={isSystem}
                  hasMedia={hasMedia}
                  hasText={hasText}
                  onMediaClick={handleMediaClick}
                  onContextMenu={(msg, x, y, isMy) => setContextMenu({ msg, x, y, isMy })}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Меню */}
      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onForward={() => onForwardMessage(contextMenu.msg)}
          
          onDelete={() => console.log('Удалить:', contextMenu.msg.id)}
        />
      )}

      {/* Твой блок zoomedMedia (я его не менял, вставь свой) */}
      {zoomedMedia && (
        <div className="zoom" onClick={() => setZoomedMedia(null)}>
           {/* ... твой код ... */}
        </div>
      )}
    </>
  );
}

export default MessageList;