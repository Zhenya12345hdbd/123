import React from 'react'
import file_icon from '../../image/file_icon.png';


function Files({ onImageClick,path,idx }) {
   
   
  return (
    
       <div className='input_files'
          alt={`image-${idx}`}
          onClick={() => onImageClick(path)}

       >
        <img className='file_icon' src={file_icon}/>
        <p>{path.name}</p>

       </div>
     
    
  );
}

export default Files;