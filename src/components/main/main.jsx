import './main.css';

import ings from './settings.png';
import user from './photo_user.avif';


function Main() {
  return (
    <div className="main">
        <div className='main_small'>
          <div className='main_small_tags'>
              <h1>Friends list <span className='tag_list'>&#8743;</span></h1>
              <img src={ings} alt/>
          </div>
          <div className='friends'>
            <div className='friends_num'>
              <h1>
              Friends
              </h1>
              <h1>
                82
              </h1>
            </div>
            
            <div className='list'>
              <div className='user_page'>
                <div className='tochka'></div>
                <img src={user} className='photo_user' alt="" />
                <p>Orlando Diggs</p>

              </div>
               <div className='user_page'>
                <div className='tochka'></div>
                <img src={user} className='photo_user' alt="" />
                <p>Orlando Diggs</p>

              </div>
               <div className='user_page'>
                <div className='tochka'></div>
                <img src={user} className='photo_user' alt="" />
                <p>Orlando Diggs</p>

              </div>
               <div className='user_page'>
                <div className='tochka'></div>
                <img src={user} className='photo_user' alt="" />
                <p>Orlando Diggs</p>

              </div>
               <div className='user_page'>
                <div className='tochka'></div>
                <img src={user} className='photo_user' alt="" />
                <p>Orlando Diggs</p>

              </div>
             

            </div>
            

          </div>
         

        </div>
        <div className='main_big'>
          
        </div>
    </div>
  );
}

export default Main;
