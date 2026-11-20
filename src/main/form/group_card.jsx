import { useLongPress } from '../hooks/useLongPress';

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
