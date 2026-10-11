

function Video({ onImageClick, path,idx }) {
   
   
  return (
    
        <video
          key={idx}
          className='img_in_message_much'
          src={path.path}
          alt={`image-${idx}`}
          onClick={() => onImageClick(path)}
        />
     
    
  );
}

export default Video;
