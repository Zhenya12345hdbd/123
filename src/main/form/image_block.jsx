import React from 'react';
import { useState } from 'react';
import Image from './tipes_file/image';
import Video from './tipes_file/video';

function ImageGrid({ media, onMediaClick }) {
    const [onn , setOnn] = useState(false);
    const [more , setMore] = useState(true);
    const [changeText , setChangeText] = useState(false)
  if (!media || media.length === 0) return null;

  const n = media.length;
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
    <div className={`div_all_image ${countClass} ${media.length > 4 && more === true ? 'little': "height_auto"} `}>
        <div  className={`shadow ${media.length > 4 ? 'more_4_inside_block' : 'more_4_inside_none'} ${onn ===  false ? 'more_4_inside_block' : 'more_4_inside_none'}`}>    
        </div>
        <div className={`text_button_show_all_image ${media.length > 4 ? 'more_4_inside_block' : 'more_4_inside_none'}`} >
            <p className='show_all' onClick={showAll}>{changeText === true ? 'Скрыть все' : 'Показать все'}</p>
        </div>
          {media.map((path, idx) => (
              path.type === 'images' ? (
            <Image
              key={idx}
              path={path}
              idx={idx}
              onImageClick={onMediaClick}
            />
          ) : path.type === 'videos' ?(
            <Video
               key={idx}
              path={path}
              idx={idx}
              onImageClick={onMediaClick}
            />
          ) : null
        ))}
    </div>
  );
}

export default ImageGrid;
