import './main.css';
import star from './star.png'
import peoople from './peoople.png';
import found from './found.png';
import ding from './ding.png';
import three from './three.png';

function ChatHeader() {
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
      <div className="search_input">
        <form>
          <input type="text" className="input_top" placeholder="Search..." />
          <button className="search_button">
            <img src={found} className="small_img found" alt="Find" />
          </button>
        </form>
        <img src={ding} alt="Ding" className="small_img pointer" />
        <div className="red_point red_point_ding"></div>
        <img src={three} alt="Three dots" className="small_img pointer" />
        <div className="red_point red_point_three"></div>
      </div>
    </div>
  );
}

export default ChatHeader;
