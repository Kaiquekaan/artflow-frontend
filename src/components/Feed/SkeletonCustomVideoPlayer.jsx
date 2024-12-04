import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faThumbsUp, faMessage, faShareNodes,  faEllipsis, faHeart, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';


const SkeletonCustomVideo = ({aspectRatio, style}) => (
    <div className="media-placeholder" 
    style={{
     aspectRatio: aspectRatio || '16/9', // Usa a proporção obtida ou um padrão inicial
     paddingTop: `${100 / (aspectRatio || 16 / 9)}%`,
     width: '100%',
     position: 'relative',
     overflow: 'hidden',
      // Cor de fundo para simular o vídeo carregando
   }}>
    
   </div>
);

export default SkeletonCustomVideo;