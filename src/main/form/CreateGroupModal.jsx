import React, { useState } from 'react';
import userPlaceholder from '../image/photo_user.avif';
import '../main.css';

function CreateGroupModal({ friends, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);

  const toggleUser = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
  console.log('ОТПРАВЛЯЕМ:', name, selected); // <-- ДОБАВЬ ЭТОТ ЛОГ
  if (!name.trim() || selected.length === 0) {
    return alert('Введите название и выберите хотя бы одного друга');
  }
  onCreate(name, selected);
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="forward-modal" onClick={e => e.stopPropagation()}>
        <h3>Создать группу</h3>
        <input 
          type="text" 
          className="forward-search" 
          placeholder="Название группы..."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="forward-list">
          {friends.map(f => (
            <div 
              key={f.id} 
              className={`forward-item ${selected.includes(f.id) ? 'selected' : ''}`}
              onClick={() => toggleUser(f.id)}
            >
              <img src={f.avatar_path || userPlaceholder} alt="avatar" />
              <span>{f.first_name} {f.last_name}</span>
              <input type="checkbox" checked={selected.includes(f.id)} readOnly />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button onClick={onClose} style={{ flex: 1 }}>Отмена</button>
          <button onClick={handleSubmit} style={{ flex: 1, background: '#70CC16', color: '#000' }}>Создать</button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupModal;