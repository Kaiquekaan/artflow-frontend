import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faXmark, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const FileUpload = ({ files, setFiles }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const RefPreviewminis = useRef(null); 
  const timerRef = useRef(null); // Para armazenar o temporizador


  const removeFile = (index) => {
    const updatedFiles = files.filter((file, i) => i !== index);
    setFiles(updatedFiles); // Atualiza os arquivos no componente pai

    if (index === currentFileIndex && updatedFiles.length > 0) {
      setCurrentFileIndex(0);
    } else if (updatedFiles.length === 0) {
      setCurrentFileIndex(null);
    }
  };


  const handleThumbnailClick = (index) => {
    setCurrentFileIndex(index); // Atualiza o índice do arquivo atualmente em exibição
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };


  const showNextImage = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex((prevIndex) => prevIndex + 1);
      handleThumbnailInteraction();
      
    }
  };

  const showPreviousImage = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex((prevIndex) => prevIndex - 1);
      handleThumbnailInteraction();
    }
  };

  const handleThumbnailInteraction = () => {
    setShowPreview(true);
  
    // Adiciona a classe 'active' imediatamente
    setTimeout(() => {
      if (RefPreviewminis.current) {
        RefPreviewminis.current.classList.add('active');
      }
    }, 0);
  
    // Limpa o temporizador existente para evitar sobreposição
    clearTimeout(timerRef.current);
  
    // Remove a classe 'active' após 3 segundos
    timerRef.current = setTimeout(() => {
      if (RefPreviewminis.current) {
        RefPreviewminis.current.classList.remove('active');
      }
  
      // Espera 300ms (a duração da transição CSS) antes de ocultar completamente o preview-minis
      setTimeout(() => {
        setShowPreview(false);
      }, 300); // Igual ao tempo da transição em seu CSS
    }, 2000);
  };



  
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);



  useEffect(() => {
    if (files.length > 0 && isFullscreen) {
      const file = files[currentFileIndex];
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          setAspectRatio(img.width / img.height);  // Define a proporção
        };
      }
    }
  }, [currentFileIndex, isFullscreen, files]);

  

  return (
    <>
    <div className='preview_container' style={{ display: 'grid'}}>
      <div className='preview-main' style={{ flex: 6  }}>
        {files.length > 0 && (
          <>
            {files[currentFileIndex].type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(files[currentFileIndex])}
                alt="Preview"
                className='preview-item'
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            ) : (
              <video
                src={URL.createObjectURL(files[currentFileIndex])}
                controls
                className='preview-item'
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            )}
             {/* Botões sobre a imagem/vídeo de preview */}

             <div className='div-btn-preview'>
             <button
              style={{
                top: '10px',
                right: '10px',
                padding: '5px 12px',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => removeFile(currentFileIndex)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <button
              style={{
                bottom: '10px',
                right: '10px',
                padding: '5px 10px',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={toggleFullscreen}
            >
              <FontAwesomeIcon icon={faExpand} />
            </button>
            
            </div>

              {/* Botões para navegação */}
              <button
                onClick={showPreviousImage}
                disabled={currentFileIndex === 0}
                className='btn-alternate'
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              <button
                onClick={showNextImage}
                disabled={currentFileIndex === files.length - 1}
                className='btn-alternate'
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>

              {/* Botão para mostrar/esconder miniaturas */}
             
            <p className='index-inticator'>{currentFileIndex + 1}/{files.length}</p>
          </>
        )}
      </div>
      {showPreview && (
          <div className="preview-minis" ref={RefPreviewminis} style={{ display: 'flex' }}>
            {files.map((file, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <div onClick={() => handleThumbnailClick(index)}>
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Thumbnail"
                      className="colunm-item"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: currentFileIndex === index ? '2px solid #39aee1' : 'none',
                      }}
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="colunm-item"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: currentFileIndex === index ? '2px solid #39aee1' : 'none',
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    {isFullscreen && (
        <div
          className='fullscreen-modal'
          style={{
            position: 'absolute',
            top: '-2%',
            left: '50%',
            minWidth: '40vw',
            height: '90vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div className='fullscreen-header'>
            
          <button
            style={{
              border: 'none',
              cursor: 'pointer',
              height: '2rem',
              marginLeft: '10px',
              
            }}
            onClick={toggleFullscreen}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          
        </div>
          {files[currentFileIndex].type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(files[currentFileIndex])}
              alt="Fullscreen Preview"
              style={{
                maxWidth: aspectRatio > 1 ? '80vw' : 'auto',  // Para imagens largas, usar 80vw
                maxHeight: aspectRatio <= 1 ? '90vh' : 'auto',  // Para imagens altas, usar 90vh
                width: aspectRatio > 1 ? 'auto' : 'auto',  // Ajustar a largura de acordo com a proporção
                height: aspectRatio <= 1 ? 'auto' : 'auto',  // Ajustar a altura de acordo com a proporção
                objectFit: 'contain',
                cursor: 'grab',
              }}
              draggable="true"
            />
          ) : (
            <video
              src={URL.createObjectURL(files[currentFileIndex])}
              controls
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                cursor: 'grab',
              }}
            />
          )}
          <div className='fullscreen-footer'> </div>
        </div>
        
      )}
      
      
    </>
  );
};

export default FileUpload;
