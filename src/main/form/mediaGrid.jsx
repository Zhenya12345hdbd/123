// ImageGrid.jsx
import React from 'react';

function ImageGrid({ media, onMediaClick }) {
  if (!media || !Array.isArray(media) || media.length === 0) return null;

  return (
    <div className="image-grid">
      {media.map((item, idx) => {
        const isImage = item.type === 'image' || /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(item.name || '');

        return (
          <div
            key={idx}
            className={`image-grid-item ${isImage ? 'image-item' : 'file-item'}`}
            onClick={() => onMediaClick(item)}
            title={item.name}
          >
            {isImage ? (
              <img src={item.path} alt={item.name} loading="lazy" />
            ) : (
              <div className="file-icon">
                <span>{item.name?.split('.').pop()?.toUpperCase() || 'FILE'}</span>
              </div>
            )}
            <div className="image-caption">{item.name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ImageGrid;
