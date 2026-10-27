import { useState } from 'react';
import '../main.css';
import star from '../image/star.png';
import peoople from '../image/peoople.png';
import found from '../image/found.png';
import ding from '../image/ding.png';
import three from '../image/three.png';
import userPlaceholder from '../image/photo_user.avif';

function ChatHeader({ onSearch, searchResults, isSearching, onClientClick, clearSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
  const value = e.target.value;
  setQuery(value);
  if (typeof onSearch === 'function') {
    onSearch(value); // вызываем поиск на сервере
  }
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
        
        <img src={ding} alt="Ding" className="small_img pointer" />
        <div className="red_point red_point_ding"></div>
        <img src={three} alt="Three dots" className="small_img pointer" />
        <div className="red_point red_point_three"></div>

        {/* Выпадающий список результатов */}
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