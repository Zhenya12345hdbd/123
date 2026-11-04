import '../main.css';
import fileIcon from '../image/file.png';
import voice from '../image/voice.png';
import smile from '../image/smile.png';
import EmojiPicker, { Categories } from 'emoji-picker-react';
import { useState, useRef } from 'react';

function MessageInput({
  onSend,
  onImageSelect,   // выбор файлов
  onImageSend,     // отправка файлов + текста
  onImageCancel,   // очистить все
  onRemoveSingleFile, // удалить один файл
  pendingFiles,
  isUploading,
}) {

  const [showEmoji, setShowEmoji] = useState(false);
  
  const textareaRef = useRef(null);

  const move_emoji = () =>{
    setShowEmoji(!showEmoji)
   
  }

  const onEmojiClick = (emojiData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Вставляем эмодзи в позицию курсора
    textarea.value = text.slice(0, start) + emojiData.emoji + text.slice(end);
    
    // Возвращаем фокус и ставим курсор после эмодзи
    textarea.focus();
    textarea.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
  }; 

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
          ref={textareaRef}
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
                  setShowEmoji(!showEmoji)
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

        <img src={smile} onClick={move_emoji} className="smile pointer" alt="Smile" />
        {showEmoji && (
              <div className={`emoji_table ${showEmoji ? 'open' : ''}`}>
                <EmojiPicker 
                className="my-picker"
                  previewConfig={{ showPreview: false }}
                  searchDisabled={true}
                  onEmojiClick={onEmojiClick} 
                  theme="dark" // Тёмная тема под твой дизайн
                  categories={[Categories.SMILEYS_PEOPLE]}
                  height={80}
                  width={1025}
                />
              </div>
            )}
      </div>
    </div>
  );
}

export default MessageInput;
