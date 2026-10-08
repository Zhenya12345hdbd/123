import React from 'react';
import { useState } from 'react';

function ImageGrid({ imagePaths, onImageClick }) {
    const [onn , setOnn] = useState(false);
    const [more , setMore] = useState(true);
    const [changeText , setChangeText] = useState(false)
  if (!imagePaths || imagePaths.length === 0) return null;

  const n = imagePaths.length;
  const countClass =
    n === 1 ? 'count-1' :
    n % 2 === 1 ? 'count-odd' :
    'count-even';

    const showAll = () =>{
            setOnn(!onn)
            setMore(!more)
            setChangeText(!changeText)
    }
    

  return (
    <div className={`div_all_image ${countClass} ${imagePaths.length > 4 ? 'more_4' : ''} ${more === halse ? 'height_auto' : 'little'}`}>
        <div  className={`shadow ${imagePaths.length > 4 ? 'more_4_inside_block' : 'more_4_inside_none'} ${onn ===  false ? 'more_4_inside_block' : 'more_4_inside_none'}`}>    
        </div>
        <div className={`text_button_show_all_image ${imagePaths.length > 4 ? 'more_4_inside_block' : 'more_4_inside_none'}`} >
            <p className='show_all' onClick={showAll}>{changeText === true ? 'Скрыть все' : 'Показать все'}</p>
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
