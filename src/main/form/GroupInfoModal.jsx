import React, { useEffect, useState } from 'react';
import userPlaceholder from '../image/photo_user.avif'; // проверьте путь к заглушке
import { API } from '../../config';
import { request } from '../api/request';
import '../main.css';

function GroupInfoModal({
  group,
  currentUserId,
  onlineUsers = [],
  onClose,
  onKickMember,
  onDeleteGroup,
  onLeaveGroup,
}) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isCreator = String(group?.creator_id) === String(currentUserId);

  // Загружаем актуальный список участников при открытии модалки
  useEffect(() => {
    if (!group?.id) return;
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const data = await request(`${API.base}/get_room_members.php?room_id=${group.id}`);
        if (!cancelled && Array.isArray(data)) {
          setMembers(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки участников группы:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [group?.id]);

  if (!group) return null;

  // Удаление отдельного участника создателем
  const handleKick = (member) => {
    if (window.confirm(`Удалить ${member.first_name} ${member.last_name} из группы?`)) {
      onKickMember?.(group.id, member.id);
      // Сразу убираем из локального списка в модалке
      setMembers((prev) => prev.filter((m) => String(m.id) !== String(member.id)));
    }
  };

  // Удаление всей группы (для создателя)
  const handleDelete = () => {
    if (window.confirm(`Удалить группу "${group.name}" для всех участников?`)) {
      onDeleteGroup?.(group.id);
      onClose();
    }
  };

  // Выход из группы (для обычного участника)
  const handleLeave = () => {
    if (window.confirm(`Выйти из группы "${group.name}"?`)) {
      onLeaveGroup?.(group.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="forward-modal" onClick={(e) => e.stopPropagation()}>
        <div className="forward-header">
          <h3>{group.name}</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <p style={{ color: '#888', fontSize: '13px', margin: '0 0 10px 0' }}>
          Участники ({isLoading ? '...' : members.length})
        </p>

        <div className="forward-list">
          {isLoading ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Загрузка участников...</p>
          ) : members.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Нет участников</p>
          ) : (
            members.map((member) => {
              const isMe = String(member.id) === String(currentUserId);
              const isMemberCreator = String(member.id) === String(group.creator_id);
              const isOnline = onlineUsers.some((id) => String(id) === String(member.id));

              return (
                <div key={member.id} className="forward-item" style={{ cursor: 'default' }}>
                  <div className="forward-item-img-name">
                    <div style={{ position: 'relative', display: 'inline-flex' }}>
                      <img src={member.avatar_path || userPlaceholder} className='forward-item-img-create' alt="avatar" />
                      <span
                        className={`tochka ${isOnline ? 'online' : 'offline'}`}
                        style={{ position: 'absolute', bottom: 0, right: 0 }}
                      />
                    </div>
                    <div>
                      <span>
                        {member.first_name} {member.last_name} {isMe && '(Вы)'}
                      </span>
                      {isMemberCreator && (
                        <div style={{ fontSize: '11px', color: '#4ea4f6' }}>Создатель</div>
                      )}
                    </div>
                  </div>

                  {/* Кнопка исключения видна ТОЛЬКО создателю и только для других участников */}
                  {isCreator && !isMe && (
                    <button
                      type="button"
                      onClick={() => handleKick(member)}
                      style={{
                        background: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Удалить
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Нижняя кнопка действия в зависимости от роли */}
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
          {isCreator ? (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                width: '100%',
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Удалить группу
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLeave}
              style={{
                width: '100%',
                background: '#555',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Выйти из группы
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupInfoModal;
