import userPlaceholder from '../image/photo_user.avif';
import delet from '../image/delete.png';
import { useLongPress } from '../hooks/useLongPress';

function UserCard({ 
  u, 
  isUserOnline, 
  isActive, 
  count, 
  onClientClick, 
  onRemoveFriend 
}) {
  // Хук вызывается внутри компонента для каждого друга отдельно
  const longPressProps = useLongPress(
    () => {
      // Долгое нажатие (удаление)
      if (window.confirm(`Это ${u.first_name} ${u.last_name}`)) {
       
      }
    },
    () => {
      // Обычный клик (открыть чат)
      onClientClick(u.id, `${u.first_name} ${u.last_name}`);
    },
    { delay: 600 }
  );

  return (
    <div className={`user_page ${isActive ? 'user_page_active' : ''}`}>
      <div className={`tochka ${isUserOnline ? 'online' : 'offline'}`} />
      
      <img 
        src={u.avatar_path || userPlaceholder} 
        className="photo_user" 
        alt={u.first_name} 
        {...longPressProps} 
      />
      
      <div className="user_info">
        <p className="name_full" onClick={() => onClientClick(u.id, `${u.first_name} ${u.last_name}`)}>
          {u.first_name} {u.last_name}
        </p>
        
        <div className='delete'>
          <img 
            src={delet} 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Удалить ${u.first_name} ${u.last_name} из друзей?`)) {
                if (onRemoveFriend) onRemoveFriend(u.id);
              }
            }} 
            alt="delete" 
          />
        </div>
        <div className="entered_message">{count > 0 ? count : ''}</div>
      </div>
    </div>
  );
}

export default UserCard;