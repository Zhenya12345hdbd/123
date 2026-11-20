import { useLongPress } from '../hooks/useLongPress';

function GroupCard({ 
  group, 
  isActive, 
  unreadCount, 
  onClientClick, 
  onLeaveGroup // на будущее, если захотите выход из группы по долгому нажатию
}) {
  const longPressProps = useLongPress(
    () => {
      // Долгое нажатие
      if (window.confirm(`Выйти из группы "${group.name}"?`)) {
        onLeaveGroup?.(group.id);
      }
    },
    () => {
      // Обычный клик (открытие чата группы)
      onClientClick(group.id, group.name, true);
    },
    { delay: 600 }
  );

  return (
    <div
      {...longPressProps}
      className={`user_page ${isActive ? 'user_page_active' : ''}`}
    >
      <div className="group_avatar"></div>
      <div className="user_info">
        <p className="name_full">{group.name}</p>
        <span style={{ fontSize: '11px', color: '#888' }}>
          {group.members_count} участников
        </span>
        <div className="entered_message">{unreadCount > 0 ? unreadCount : ''}</div>
      </div>
    </div>
  );
}

export default GroupCard;
