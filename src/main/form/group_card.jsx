import { useLongPress } from '../hooks/useLongPress';
import userPlaceholder from '../image/photo_user.avif';

function GroupCard({
  group,
  isActive,
  unreadCount,
  onClientClick,
  onOpenGroupInfo, // <-- новый пропс для открытия списка участников
  currentUserId,
  onlineUsers = [],
}) {
  // Хук привязывается только к иконке группы
  const avatarLongPressProps = useLongPress(
    () => {
      if (!group) return;
      onOpenGroupInfo?.(group); // открываем модалку с участниками
    },
    () => {
      // Обычный клик по иконке тоже просто открывает чат
      if (!group) return;
      onClientClick(group.id, group.name, true);
    },
    { delay: 600 }
  );

  if (!group) return null;

  const avatars = Array.isArray(group.member_avatars)
    ? group.member_avatars.slice(0, 4)
    : [];

  const onlineSet = new Set(onlineUsers.map(String));
  const isAnyoneOnline = Boolean(
    group?.member_ids?.some(
      (id) => String(id) !== String(currentUserId) && onlineSet.has(String(id))
    )
  );

  return (
    <div
      onClick={() => onClientClick(group.id, group.name, true)}
      className={`user_page ${isActive ? 'user_page_active' : ''}`}
    >
      <div className={`tochka ${isAnyoneOnline ? 'online' : 'offline'}`} />

      {/* Долгое нажатие вешаем строго на иконку группы */}
      <div
        {...avatarLongPressProps}
        onClick={(e) => e.stopPropagation()} // чтобы не сработал двойной клик с родителем
        className="group_avatar"
        title="Удерживайте, чтобы посмотреть участников"
      >
        {avatars.length > 0 ? (
          avatars.map((avatarPath, index) => (
            <img
              className="group_avatar_item"
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
