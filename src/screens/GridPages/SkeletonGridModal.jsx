import React, { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft,faArrowLeft, faChevronRight, faThumbsUp, faMessage, faEllipsis, faCircleXmark, faArrowTurnDown, faMinus, faPlus, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import CustomVideoPlayer from '../../components/Feed/CustomVideoPlayer';
import { UserContext } from '../../Context/UserContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import api from '../../api';

const SkeletonGridModal = ({}) => {




  return (
      <div className={`modal-content gridpage`} >
        <div className='modal-user-grid-container'>
        <button className="modal-close-btn gridpage" >
        <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className='grid-post-title'>Post</div>
        </div>
        <div className={`modal-left gridpage`}>
       
          {/* Botão de navegação para a mídia anterior */}
          <button className="modal-nav-btn left" >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Renderizar a mídia atual (imagem ou vídeo) */}
          <div className='spiiner-container'>
          <div className="spinner"></div> 
          </div>
          {/* Botão de navegação para a próxima mídia */}
          <button className="modal-nav-btn right" >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className={`modal-right gridpage`}>
          <div className='model-header gridpage'>
          <div className="modal-user-info gridpage">
            <div
              alt="Profile"
              className="modal-profile-picture loading"
            />
            <div>
              <p className='modal-user-info-main-p loading'></p>
              <p className='modal-user-info-tag-p laoding'></p>
            </div>
          </div>
          <div className="modal-caption gridpage loading">
            <p></p>
          </div>
          </div>
          <div className="modal-comments gridpage">
            {/* Exibir comentários */}

        
          </div>
          <div className='modal-comment-add-container'>
            <div className='div-coment-input'>
            <div  alt='user_picture'  className='img-loading-modal'/>
            <form   className="comment-form">

            <textarea
              className="comment-input"
            />

              
            </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SkeletonGridModal;
