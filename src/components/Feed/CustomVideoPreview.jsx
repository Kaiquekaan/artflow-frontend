import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import './CustomVideoPlayer.css'

const CustomVideoPreview = ({ videoUrl, postId, style }) => {
    const navigate = useNavigate();

    // Função para redirecionar ao post completo
    const handleVideoClick = () => {
        navigate(`/post/${postId}`);
    };

    return (
        <div className={`video-preview-container ${style ? style : ''}`} onClick={handleVideoClick}>
            <video src={`${videoUrl}#t=0.5`} alt="Video Thumbnail" className="video-preview-thumbnail"></video>
            <div className="video-preview-overlay">
                <FontAwesomeIcon icon={faPlayCircle} className="video-preview-icon" />
            </div>
        </div>
    );
};

export default CustomVideoPreview;
