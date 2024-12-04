import React from 'react';
import './ShareModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark  } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faSquareFacebook, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCopy as CopyResgular} from '@fortawesome/free-regular-svg-icons';


const ShareModal = ({ isOpen, onClose, shareLink }) => {
    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
    };

    return (
        <div className="share-modal-overlay">
            <div className="share-modal">
                <button className="close-btn" onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
                <h5>Compartilhar Post</h5>
                <div className='share-link-container'>
                <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="share-link"
                />
                <button onClick={copyToClipboard} className="copy-btn"><FontAwesomeIcon icon={CopyResgular} /></button>
                </div>
                <div className="share-options">
                    <p>Compartilhar via:</p>
                    <button onClick={() => window.open(`https://twitter.com/share?url=${shareLink}`, "_blank")} className='twitter-btn'>
                    <FontAwesomeIcon icon={faXTwitter} />
                    </button>
                    <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`, "_blank")}  className='Facebook-btn'>
                    <FontAwesomeIcon icon={faSquareFacebook} />
                    </button>
                    <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${shareLink}`, "_blank")}  className='whatsapp-btn'>
                    <FontAwesomeIcon icon={faWhatsapp} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;