function MediaGrid({ media, onMediaClick }) {
  if (!media || media.length === 0) return null;

  return (
    <div className="media-grid">
      {media.map((item, idx) => {
        const isVideo = item.type === 'video';

        return (
          <div
            key={idx}
            className="media-grid-item"
            onClick={() => onMediaClick(item)}
          >
            {isVideo ? (
              <video
                src={item.path}
                className="media-thumb"
                preload="metadata"
                muted
              />
            ) : (
              <img
                src={item.path}
                alt={item.name || 'image'}
                className="media-thumb"
                loading="lazy"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MediaGrid;
