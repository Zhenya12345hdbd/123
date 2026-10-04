import React from 'react';
import { useState } from 'react';

function ImageGrid({ imagePaths, onImageClick }) {
    const [onn , setOnn] = useState('more_4_inside_block');
    const [more , setMore] = useState('more_4');
  if (!imagePaths || imagePaths.length === 0) return null;

  const n = imagePaths.length;
  const countClass =
    n === 1 ? 'count-1' :
    n % 2 === 1 ? 'count-odd' :
    'count-even';

    const showAll = () =>{
            setOnn('more_4_inside_none')
            setMore('little')
    }
    

  return (
    <div className={`div_all_image ${countClass} ${imagePaths.length > 4 ? 'more_4' : ''} ${more}`}>
        <div  className={`shadow ${imagePaths.length > 4 ? 'more_4_inside_block' : 'more_4_inside_none'} ${onn}`}>
            <p className='show_all' onClick={showAll}>показать все</p>
        </div>
      {imagePaths.map((path, idx) => (
        <img
          key={idx}
          className='img_in_message_much'
          src={path}
          alt={`image-${idx}`}
          onClick={() => onImageClick(path)}
        />
      ))}
    </div>
  );
}

export default ImageGrid;
