import { useRef } from 'react';

export function useLongPress(onLongPress, onClick, { delay = 600 } = {}) {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const start = (e) => {
    // Если это не кнопка мыши (например, правая кнопка) — игнорируем
    if (e.type === 'mousedown' && e.button !== 0) return;
    
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress(e);
    }, delay);
  };

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e) => {
    // Если это было долгое нажатие, не вызываем обычный клик
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }
    if (onClick) onClick(e);
  };

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onClick: handleClick,
  };
}