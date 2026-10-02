import '../main.css';
import file from '../image/file.png';
import voice from '../image/voice.png';
import smile from '../image/smile.png';

function MessageInput({
  onSend,
  onImageSelect,
  onImageSend, // теперь это «отправить всё»
  onImageCancel,
  onRemoveSingleFile,
  pendingFiles,
  isUploading,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = e.target.querySelector('textarea');
    const text = textarea.value.trim();

    // Если есть картинки — отправляем их + текст
    if (pendingFiles.length > 0) {
      await onImageSend(text); // передаём текст как аргумент
      textarea.value = '';
      return;
    }

    // Иначе — только текст
    if (text) {
      onSend(text);
      textarea.value = '';
    }
  };

  return (
    <div className="footer_input">
     

      {/* Превью выбранных картинок */}
      {pendingFiles.length > 0 && (
        <div className='previu_image'>
          {pendingFiles.map((file, idx) => (
            <div key={idx} className='prev_img_div'>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <button
                className='button_delete_one_image'
                onClick={() => onRemoveSingleFile(idx)}
                style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', border: 'none', background: '#ff4444', color: '#fff', cursor: 'pointer', padding: 0, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='footer_main'>
            <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImageSelect}
            style={{ display: 'none' }}
            id="image-input"
          />

          <label htmlFor="image-input" className="pointer" style={{ cursor: 'pointer' }}>
            <img src={file} className="footer_img pointer" alt="File" />
          </label>

          <img src={voice} className="footer_img pointer" alt="Voice" />
            <form onSubmit={handleSubmit}>
              <textarea
                className="main_form"
                placeholder={
                  pendingFiles.length > 0
                    ? `Нажмите Enter для отправки ${pendingFiles.length} ${pendingFiles.length === 1 ? 'картинки' : 'картинок'} и текста...`
                    : 'Напиши сообщение...'
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const text = e.target.value.trim();

                    if (pendingFiles.length > 0) {
                      onImageSend(text);
                      e.target.value = '';
                      return;
                    }

                    if (text) {
                      onSend(text);
                      e.target.value = '';
                    }
                  }
                }}
              ></textarea>
            </form>
            <img src={smile} className="smile pointer" alt="Smile" />
        </div>
      </div>
  );
}

export default MessageInput;
