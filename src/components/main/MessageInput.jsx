import './main.css';
import file from './file.png';
import voice from './voice.png';
import smile from './smile.png';

function MessageInput({ onSend }) {
  const handleSend = (text) => {
    if (text) {
      onSend(text);
    }
  };

  return (
    <div className="footer_input">
      <img src={file} className="footer_img pointer" alt="File" />
      <img src={voice} className="footer_img pointer" alt="Voice" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const textarea = e.target.querySelector('textarea');
          const text = textarea.value.trim();
          if (text) {
            handleSend(text);
            textarea.value = '';
          }
        }}
      >
        <textarea
          className="main_form"
          placeholder="Напиши сообщение..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const text = e.target.value.trim();
              if (text) {
                handleSend(text);
                e.target.value = '';
              }
            }
          }}
        ></textarea>
      </form>
      <img src={smile} className="smile pointer" alt="Smile" />
    </div>
  );
}

export default MessageInput;
