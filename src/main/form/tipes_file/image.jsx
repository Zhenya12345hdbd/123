import React from 'react';


function Image({ onImageClick, path,idx }) {
   
   
  return (
    
        <img
          key={idx}
          className='img_in_message_much'
          src={path.path}
          alt={`image-${idx}`}
          onClick={() => onImageClick(path)}
        />
     
    
  );
}

export default Image;
