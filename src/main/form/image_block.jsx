import React from 'react';
import { useState } from 'react';
import Image from './tipes_file/image';
import Video from './tipes_file/video';
import Files from './tipes_file/files';
import { useRef, useEffect } from 'react';


function ImageGrid({ media, onMediaClick }) {
    const [onn , setOnn] = useState(false);
    const [more , setMore] = useState(true);
    const gridRef = useRef(null);
    const [changeText , setChangeText] = useState(false)
    const [realHeight, setRealHeight] = useState(0);
    const [little, setLittle] = useState(true);

    useEffect(() => {
    if (gridRef.current) {
      setRealHeight(gridRef.current.offsetHeight);
      // теперь у тебя есть реальная высота блока в пикселях
    }
  }, [media]);

  const needsButton = realHeight > 0 && realHeight > 280 && more;
  const heightClass = needsButton ? 'little' : 'height_auto';

  if (!media || media.length === 0) return null;

  const n = media.length;
  const countClass =
    n === 1 ? 'count-1' :
    n % 2 === 1 ? 'count-odd' :
    'count-even';
    
    const hasFile = media.filter(item => item.type === 'files').length;
    


    const showAll = () =>{
            setOnn(!onn)
            setMore(!more)
            setChangeText(!changeText)
    }
    
    

  return (
    <div className={`${hasFile > 1 ? 'div_all_image_small' : 'div_all_image' } ${countClass}  ${needsButton && more === true ? 'little': "height_auto"}  `} ref={gridRef}>
        <div  className={`shadow ${needsButton && more === true ? 'more_4_inside_block' : 'more_4_inside_none'} ${onn ===  false ? 'more_4_inside_block' : 'more_4_inside_none'}`}>    
        </div>
        <div className={`text_button_show_all_image ${needsButton ? 'more_4_inside_block' : 'more_4_inside_none'}`} >
            <p className='show_all' onClick={showAll}>{changeText === true ? 'Скрыть все' : 'Показать все'}</p>
            <p>{realHeight}</p>
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
          ) : path.type === 'files' ?(
            <Files
               key={idx}
              path={path}
              idx={idx}
              onImageClick={onMediaClick}
            />
          ): null
        ))}
    </div>
  );
}

export default ImageGrid;
