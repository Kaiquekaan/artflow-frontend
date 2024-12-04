import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faThumbsUp, faMessage, faShareNodes,  faEllipsis, faHeart, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';


const SkeletonPost = () => (
  <div className="skeleton-post">
    <div className="skeleton-profile-pic"></div>
    <div className="skeleton-content">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-subtitle"></div>
      <div className="skeleton-line skeleton-caption"></div>
      <div className="skeleton-image-post"></div>
      <div className='post-footer-container'>
      <div className='post-item-footer'>
              <div className={`post-item-btn loading`}><button ></button></div>
              
              <div className={`post-item-btn loading`}><button ></button></div>
              
              <div className='post-item-btn loading'><button ></button></div> 
             
              <div className='post-item-btn loading'><button></button></div>
              

              </div>
            </div>
    </div>
  </div>
);

export default SkeletonPost;