import '../main.css';
import fileIcon from '../image/file.png';
import voice from '../image/voice.png';
import smile from '../image/smile.png';

function MessageInput({
  onSend,
  onImageSelect,   // выбор файлов
  onImageSend,     // отправка файлов + текста
  onImageCancel,   // очистить все
  onRemoveSingleFile, // удалить один файл
  pendingFiles,
  isUploading,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = e.target.querySelector('textarea');
    const text = textarea.value.trim();

    if (pendingFiles.length > 0) {
      await onImageSend(text);
      textarea.value = '';
      return;
    }

    if (text) {
      onSend(text);
      textarea.value = '';
    }
  };

  // Определяем превью для файла
  const renderPreview = (file, idx) => {
    const isImage = file.type && file.type.startsWith('image/');
    const isVideo = file.type && file.type.startsWith('video/');
    const isAudio = file.type && file.type.startsWith('audio/');

    return (
      <div key={idx} className="prev_img_div">
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt={`preview-${idx}`}
            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
          />
        ) : isVideo ? (
          <video
            src={URL.createObjectURL(file)}
            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
            muted
          />
        ) : (
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '6px',
            background: '#e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#666',
            textAlign: 'center',
            padding: '4px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}>
            <span style={{ fontSize: '22px' }}>
              {isAudio ? '🎵' : '📄'}
            </span>
            <span style={{
              maxWidth: '56px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {file.name}
            </span>
          </div>
        )}
        <button
          className="button_delete_one_image"
          onClick={() => onRemoveSingleFile(idx)}
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: 'none',
            background: '#ff4444',
            color: '#fff',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
    );
  };

  return (
    <div className="footer_input">
      {/* Превью выбранных файлов */}
      {pendingFiles.length > 0 && (
        <div className="previu_image">
          {pendingFiles.map((file, idx) => renderPreview(file, idx))}
        </div>
      )}

      <div className="footer_main">
        {/* accept убран — можно выбирать любые файлы */}
        <input
          type="file"
          multiple
          onChange={onImageSelect}
          style={{ display: 'none' }}
          id="image-input"
        />

        <label htmlFor="image-input" className="pointer" style={{ cursor: 'pointer' }}>
          <img src={fileIcon} className="footer_img pointer" alt="File" />
        </label>

        <img src={voice} className="footer_img pointer" alt="Voice" />

        <form onSubmit={handleSubmit}>
          <textarea
            className="main_form"
            placeholder={
              isUploading
                ? 'Загрузка файлов...'
                : pendingFiles.length > 0
                  ? `Нажмите Enter для отправки ${pendingFiles.length} ${pendingFiles.length === 1 ? 'файла' : 'файлов'} и текста...`
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
