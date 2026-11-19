import React, { useState } from 'react';
import userPlaceholder from '../image/photo_user.avif';
import '../main.css';

function ForwardModal({ friends = [], groups = [], onClose, onForward }) {
  const [search, setSearch] = useState('');

  const filteredFriends = friends.filter(f =>
    `${f.first_name} ${f.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGroups = groups.filter(g =>
    (g.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="forward-modal" onClick={e => e.stopPropagation()}>
        <div className="forward-header">
          <h3>Переслать сообщение</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <input
          type="text"
          placeholder="Поиск по друзьям и группам..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="forward-search"
        />

        <div className="forward-list">
          {filteredGroups.length > 0 && (
            <>
              <div style={{ fontSize: '12px', color: '#888', padding: '6px 10px' }}>
                Группы
              </div>
              {filteredGroups.map(group => (
                <div
                  key={`group_${group.id}`}
                  className="forward-item"
                  onClick={() => onForward(group.id, true)}
                >
                  <div className="group_avatar" style={{ marginRight: '10px' }}>👥</div>
                  <span>{group.name}</span>
                </div>
              ))}
            </>
          )}

          {filteredFriends.length > 0 && (
            <>
              <div style={{ fontSize: '12px', color: '#888', padding: '6px 10px' }}>
                Друзья
              </div>
              {filteredFriends.map(friend => (
                <div
                  key={`friend_${friend.id}`}
                  className="forward-item"
                  onClick={() => onForward(friend.id, false)}
                >
                  <img src={friend.avatar_path || userPlaceholder} alt="avatar" />
                  <span>{friend.first_name} {friend.last_name}</span>
                </div>
              ))}
            </>
          )}

          {filteredFriends.length === 0 && filteredGroups.length === 0 && (
            <p style={{ color: '#888', textAlign: 'center' }}>Ничего не найдено</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForwardModal;
