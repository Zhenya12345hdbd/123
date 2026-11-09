import '../main.css';

function MessageContextMenu({ x, y, onClose, onDelete, onForward }) {
  return (
    <>
      {/* Затемнение фона (чтобы клик по пустому месту закрывал меню) */}
      <div 
        style={{ position: 'fixed', inset: 0, zIndex: 999 }} 
        onClick={onClose} 
      />
      
      {/* Само меню */}
      <div 
        className="context-menu"
        style={{ 
          position: 'fixed', 
          top: y, 
          left: x, 
          zIndex: 1000,
          background: '#2b2b2b',
          border: '1px solid #444',
          borderRadius: '8px',
          padding: '5px 0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          minWidth: '150px'
        }}
      >
        <div className="context-menu-item" onClick={() => { onForward(); onClose(); }}>
          📤 Переслать
        </div>
        <div className="context-menu-item" onClick={() => { onForward(); onClose(); }}>
          📤 Редактировать
        </div>
        <div className="context-menu-item" onClick={() => { onDelete(); onClose(); }} style={{ color: '#ff4444' }}>
          🗑️ Удалить
        </div>
      </div>
    </>
  );
}

export default MessageContextMenu;