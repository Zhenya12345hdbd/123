import React, { useState } from 'react';
import '../main.css';
import user from '../image/photo_user.avif';
/* import ImageGrid from './image_block'; */
import ImageGrid from './mediaGrid';

function MessageList({ messages, currentUser, chatRef, isConnected }) {
    const [zoomedMedia, setZoomedMedia] = useState(null);

    if (!currentUser) return null;

    const handleMediaClick = (item) => {
        setZoomedMedia(item);
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
                                                <div>
                                                    <h2 className="name_user">{msg.username || 'Пользователь'}</h2>
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

            {zoomedMedia && (
                <div className="zoom" onClick={() => setZoomedMedia(null)}>
                    {zoomedMedia.type === 'video' ? (
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
                    ) : zoomedMedia.type === 'image' ? (
                        <img
                            className="zoomed_img"
                            src={zoomedMedia.path}
                            alt="Zoomed"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <div className="zoomed_file" onClick={(e) => e.stopPropagation()}>
                            <p>{zoomedMedia.name || 'Файл'}</p>
                            <a href={zoomedMedia.path} download className="btn_download">
                                Скачать
                            </a>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default MessageList;
