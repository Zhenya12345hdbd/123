import { useState } from 'react';
import '../main.css';
import star from '../image/star.png';
import peoople from '../image/peoople.png';
import found from '../image/found.png';
import ding from '../image/ding.png'
import three from '../image/three.png';
import userPlaceholder from '../image/photo_user.avif';
import add_friends from '../image/add_friend.png';
import added_friend from '../image/added_friend.png';

function ChatHeader({ 
  onSearch, 
  searchResults, 
  isSearching, 
  onClientClick, 
  clearSearch, 
  friends, 
  onSendRequest, 
  friendRequests, 
  onHandleRequest // <-- Принимаем правильный пропс
}) {
  const [query, setQuery] = useState('');
  const [showRequests, setShowRequests] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setShowRequests(false)
    setQuery(value);
    if (typeof onSearch === 'function') {
      onSearch(value);
    }
  };

  const isFriend = (userId) => {
    return friends && friends.some(f => String(f.id) === String(userId));
  };

  const handleRequestAction = (requestId, action) => {
    // Вызываем функцию из main.jsx
    if (onHandleRequest) {
      onHandleRequest(requestId, action);
    }
    // Убираем из локального UI (в main.jsx это тоже произойдет, но для мгновенного отклика)
    setShowRequests(false); 
  };

  const handleUserClick = (user) => {
    onClientClick(user.id, `${user.first_name} ${user.last_name}`);
    setQuery('');
    clearSearch();
    
  };

  return (
    <div className="search_line">
      <div className="search">
        <div className="tag_now">
          <h1>#general</h1>
          <img src={star} className="small_img" alt="Star" />
        </div>
        <div className="num">
          <img src={peoople} className="small_img" alt="People" />
          <h3>1,093</h3>
        </div>
      </div>
      
      <div className="search_input" style={{ position: 'relative' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="input_top"
            placeholder="Поиск пользователей..."
            value={query}
            onChange={handleInputChange}
          />
          <button className="search_button" type="button">
            <img src={found} className="small_img found" alt="Find" />
          </button>
        </form>
        
        {/* Иконка колокольчика с заявками */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          
         {showRequests===true && friendRequests?.length > 0 && (
            <div className="friend-requests-dropdown">
              <h4>Заявки в друзья</h4>
              {friendRequests.map(req => (
                <div key={req.request_id} className="request-item">
                  <img src={req.sender_avatar || userPlaceholder} alt="avatar" />
                  <span>{req.sender_name}</span>
                  <div className="request-actions">
                    <button onClick={() => handleRequestAction(req.request_id, 'accept')} className="btn-accept">✓</button>
                    <button onClick={() => handleRequestAction(req.request_id, 'reject')} className="btn-reject">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
 
        </div>
            <img 
            src={ding} 
            alt="Ding" 
            className="small_img pointer"
             onClick={() => {
                setShowRequests(!showRequests);
                setQuery(''); // <-- Очищаем поиск при открытии заявок
                clearSearch(); // <-- Сбрасываем результаты поиска
  }}  // <-- Открываем/закрываем
          />
          {/* Красная точка, если есть заявки */}
          {friendRequests?.length > 0 && !showRequests && (
             <div className="red_point red_point_ding"></div>
          )}
        <img src={three} alt="Three dots" className="small_img pointer" />
        <div className="red_point red_point_three"></div>

        {/* Выпадающий список поиска */}
        {query.trim() !== '' && (
          <div className="search_results_dropdown">
            {isSearching ? (
              <div className="search_result_item" style={{ color: '#888' }}>Поиск...</div>
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((u) => (
                <div
                  key={u.id}
                  className="search_result_item"
                  onClick={() => handleUserClick(u)}
                >
                  <img
                    src={u.avatar_path || userPlaceholder}
                    className="search_result_avatar"
                    alt={u.first_name}
                  />
                  <span>{u.first_name} {u.last_name}</span>
                  {isFriend(u.id) ? (
                    <div className='added_friend'><img src={added_friend} alt="added" /></div>
                  ) : (
                    <div className='add_friend'>
                      <img 
                        src={add_friends} 
                        alt="add"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onSendRequest(u.id); // Отправляем заявку
                        }} 
                      /> 
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="search_result_item" style={{ color: '#888' }}>Ничего не найдено</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;