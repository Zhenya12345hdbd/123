import './main.css';

import ings from './settings.png';
import user from './photo_user.avif';
import star from './star.png';
import peoople from './peoople.png';
import found from './found.png'
import ding from './ding.png'
import three from './three.png'
import voice from './voice.png'
import smile from './smile.png'
import file from './file.png'
import { useRef, useState, useEffect } from 'react';




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
          <div className='search_line'>
              <div className='search'>
                <div className='tag_now'>
                  <h1>
                    #general
                  </h1>
                  <img src={star} className='small_img' alt/>
                  
                </div>
                <div className='num'>
                  <img src={peoople} className='small_img' alt=''/>
                  <h3>
                    1,093
                  </h3>
                </div>
            </div>
            <div className='search_input'>
                  <form>
                      <input type="text" className='input_top' placeholder='Search...' />
                        <button className='search_button'><img src={found} className='small_img found' alt="" /></button>
                  </form>
                  <img src={ding} alt='' className='small_img pointer'/>
                  <div className='red_point red_point_ding'>

                  </div>
                  <img src={three} alt='' className='small_img pointer'/>
                  <div className='red_point red_point_three'>
                  </div>

                </div>

          </div>
          <div className='message_area' >
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            <div className='message'>
              <img src={user} className='photo_user' alt/>
                <div className='message_user'>
                  <div className='user_date'>
                        <h2 className='name_user'>
                      Orlando Diggs
                      </h2>
                      <h4>
                        6:38 PM
                      </h4>
                  </div>
                    
                    <p className='text_message'>
                      Working from a van in Australia isn’t feasible if you need internet. It may have improved over the last years but I spent some time in a camper van around Tasmania and internet was a real problem (and Tasmania is tiny compared to the rest of the country).
                    </p>
                </div>

            </div>
            

          </div>
          <div className='footer_input'>
            <img src={file} className= ' footer_img pointer' alt=''/>
            <img src={voice} className= 'footer_img pointer' alt=''/>
            <form>
              <textarea className='main_form'>
                
              </textarea>
            </form>
            <img src={smile} className='smile pointer' alt=''/>


          </div>
          
          
        </div>
    </div>
  );
}

export default Main;
