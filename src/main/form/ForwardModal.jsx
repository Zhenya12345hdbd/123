import React, { useState } from 'react';
import userPlaceholder from '../image/photo_user.avif';
import '../main.css';

function ForwardModal({ friends, onClose, onForward }) {
  const [search, setSearch] = useState('');

  const filteredFriends = friends.filter(f => 
    `${f.first_name} ${f.last_name}`.toLowerCase().includes(search.toLowerCase())
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
          placeholder="Поиск по друзьям..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="forward-search"
        />

        <div className="forward-list">
          {filteredFriends.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Друзья не найдены</p>
          ) : (
            filteredFriends.map(friend => (
              <div 
                key={friend.id} 
                className="forward-item"
                onClick={() => onForward(friend.id)}
              >
                <img src={friend.avatar_path || userPlaceholder} alt="avatar" />
                <span>{friend.first_name} {friend.last_name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ForwardModal;