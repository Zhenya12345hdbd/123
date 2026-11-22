import { useLongPress } from '../hooks/useLongPress';
import userPlaceholder from '../image/photo_user.avif';

function GroupCard({ group, isActive, unreadCount, onClientClick, onLeaveGroup }) {
  // 1. Хук вызывается всегда на самом верхнем уровне
  const longPressProps = useLongPress(
    () => {
      if (!group) return;
      if (window.confirm(`Выйти из группы "${group.name}"?`)) {
        onLeaveGroup?.(group.id);
      }
    },
    () => {
      if (!group) return;
      onClientClick(group.id, group.name, true);
    },
    { delay: 600 }
  );

  // 2. Проверка только ПОСЛЕ всех хуков
  if (!group) return null;

  // Берём первые 4 аватарки из массива
  const avatars = Array.isArray(group.member_avatars)
    ? group.member_avatars.slice(0, 4)
    : [];

  return (
    <div
      {...longPressProps}
      className={`user_page ${isActive ? 'user_page_active' : ''}`}
    >
      {/* Картинки рендерятся строго внутри иконки группы */}
      <div className={`group_avatar`}>
        {avatars.length > 0 ? (
          avatars.map((avatarPath, index) => (
            <img
            className='group_avatar_item'
              key={index}
              src={avatarPath || userPlaceholder}
              alt=""
              
            />
          ))
        ) : (
          <img src={userPlaceholder} alt="" className="group_mini_avatar" />
        )}
      </div>

      <div className="user_info">
        <p className="name_full">{group.name}</p>
        
        <div className="entered_message">{unreadCount > 0 ? unreadCount : ''}</div>
      </div>
    </div>
  );
}

export default GroupCard;
