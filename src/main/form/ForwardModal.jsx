import React, { useState } from 'react';
import userPlaceholder from '../image/photo_user.avif';
import '../main.css';

function ForwardModal({ friends = [], onClose, onForward }) {
  const [search, setSearch] = useState('');

  // Фильтрация и по группам, и по друзьям
  const filteredList = friends.filter((item) => {
    const fullName = item.isGroup
      ? item.name || ''
      : `${item.first_name || ''} ${item.last_name || ''}`;

    return fullName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="forward-modal" onClick={(e) => e.stopPropagation()}>
        <div className="forward-header">
          <h3>Переслать сообщение</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <input
          type="text"
          placeholder="Поиск по чатам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="forward-search"
        />

        <div className="forward-list">
          {filteredList.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Чаты не найдены</p>
          ) : (
            filteredList.map((item) => {
              // Берём первые 4 аватарки, если это группа
              const avatars =
                item.isGroup && Array.isArray(item.member_avatars)
                  ? item.member_avatars.slice(0, 4)
                  : [];

              return (
                <div
                  key={item.uniqueKey || `${item.isGroup ? 'group' : 'user'}_${item.id}`}
                  className="forward-item-space"
                  onClick={() => onForward(item.id, item.isGroup)}
                >
                  {item.isGroup ? (
                    /* Коллаж из 4 аватарок, как в Sidebar */
                    <div className='group_avatar_forvard'>
                      {avatars.length > 0 ? (
                        avatars.map((avatarPath, index) => (
                          <img
                            key={index}
                            src={avatarPath || userPlaceholder}
                            alt=""
                            className='group_avatar_item_forvard'
                          />
                        ))
                      ) : (
                        <img src={userPlaceholder} alt="" className="group_mini_avatar" />
                      )}
                    </div>
                  ) : (
                    /* Обычная аватарка пользователя */
                    <img
                      src={item.avatar_path || userPlaceholder}
                      alt="avatar"
                      className='forward-item_img_friend'
                    />
                  )}

                  <span>
                    {item.isGroup ? item.name : `${item.first_name} ${item.last_name}`}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ForwardModal;
