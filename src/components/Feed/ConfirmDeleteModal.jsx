import React, { useState } from 'react';


const ConfirmDeleteModal = ({ isOpen, onRequestClose, onConfirm }) => {
    if (!isOpen) return null; // Não renderiza se não estiver aberto

    return (
      <div className="modal-overlay">
        <div className="modal-content-confirm">
          <p>Deseja deletar este post?</p>
          <div className="modal-buttons">
            <button onClick={onConfirm} className='btn-blue'>Deletar</button>
            <button onClick={onRequestClose} className='btn-white'>Cancelar</button>
          </div>
        </div>
      </div>
    );
  
};

export default ConfirmDeleteModal;
