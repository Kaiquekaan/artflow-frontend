import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faXmark, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const EditPostFileUpload = ({ files, setFiles, onRemove }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const RefPreviewminis = useRef(null); 
  const timerRef = useRef(null);

  console.log('Files vindo para o edit: ', files)

  const removeFile = (index) => {
    const fileToRemove = files[index];
  
    // Se for um arquivo existente (tem URL), adicioná-lo à lista de remoção
    if (fileToRemove.url) {
      setFilesToRemove((prev) => [...prev, fileToRemove]);
    }
  
    // Atualizar a lista de arquivos visíveis
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  
    if (index === currentFileIndex && updatedFiles.length > 0) {
      setCurrentFileIndex(0);
    } else if (updatedFiles.length === 0) {
      setCurrentFileIndex(null);
    }
  };

  useEffect(() => {
    // Sempre que a lista de arquivos a remover mudar, notificar o componente pai
    if (onRemove) {
      onRemove(filesToRemove);
    }
  }, [filesToRemove, onRemove]);

  const handleThumbnailClick = (index) => {
    setCurrentFileIndex(index);
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
    setTimeout(() => {
      if (RefPreviewminis.current) {
        RefPreviewminis.current.classList.add('active');
      }
    }, 0);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (RefPreviewminis.current) {
        RefPreviewminis.current.classList.remove('active');
      }
      setTimeout(() => {
        setShowPreview(false);
      }, 300);
    }, 2000);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (files.length > 0 && isFullscreen) {
      const file = files[currentFileIndex];
      const img = new Image();
      img.src = file.url; // Como os arquivos são sempre URLs
      img.onload = () => {
        setAspectRatio(img.width / img.height);  // Define a proporção
      };
    }
  }, [currentFileIndex, isFullscreen, files]);

  useEffect(() => {
    return () => {
      // Limpar URLs temporárias quando o componente for desmontado
      files.forEach(file => {
        if (file instanceof File) {
          URL.revokeObjectURL(file);
        }
      });
    };
  }, [files]);

  const isImage = (file) => {
    let fileExtension;
  
    // Verificar se é um arquivo novo ou existente
    if (file.file) {
      // Caso seja um arquivo existente (vindo do backend)
      fileExtension = file.file.split('.').pop().toLowerCase();
    } else if (file.name) {
      // Caso seja um novo arquivo (objeto File do input)
      fileExtension = file.name.split('.').pop().toLowerCase();
    } else {
      return false;  // Se não houver como identificar o tipo de arquivo
    }
  
    return ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
  };


  const isVideo = (file) => {
    let fileExtension;
  
    // Verificar se é um arquivo novo ou existente
    if (file.file) {
      fileExtension = file.file.split('.').pop().toLowerCase();
    } else if (file.name) {
      fileExtension = file.name.split('.').pop().toLowerCase();
    } else {
      return false;
    }
  
    return ['mp4', 'webm', 'ogg'].includes(fileExtension);
  };

  const getFileURL = (file) => {
    // Se o arquivo é existente (vem do servidor), usar file.url
    if (file.url) {
      return file.url;
    }
    // Se o arquivo é novo (não tem URL), criar uma URL temporária para visualização
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <>
      <div className='preview_container' style={{ display: 'grid' }}>
        <div className='preview-main' style={{ flex: 6 }}>
          {files.length > 0 && (
            <>
              {isImage(files[currentFileIndex]) ? (
                <img
                  src={getFileURL(files[currentFileIndex])}
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
                isVideo(files[currentFileIndex]) && (
                  <video
                    src={getFileURL(files[currentFileIndex])} 
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
                )
              )}

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

              <button
                onClick={showPreviousImage}
                disabled={currentFileIndex === 0}
                className='btn-alternate'
                style={{ position: 'absolute', top: '50%', left: '10px' }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              <button
                onClick={showNextImage}
                disabled={currentFileIndex === files.length - 1}
                className='btn-alternate'
                style={{ position: 'absolute', top: '50%', right: '10px' }}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>

              <p className='index-indicator'>{currentFileIndex + 1}/{files.length}</p>
            </>
          )}
        </div>

        {showPreview && (
          <div className="preview-minis" ref={RefPreviewminis} style={{ display: 'flex' }}>
            {files.map((file, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <div onClick={() => handleThumbnailClick(index)}>
                  {isImage(file) ? (
                    <img
                      src={getFileURL(file)}
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
                    isVideo(file) && (
                      <video
                        src={getFileURL(file)}
                        className="colunm-item"
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: currentFileIndex === index ? '2px solid #39aee1' : 'none',
                        }}
                      />
                    )
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

          {isImage(files[currentFileIndex]) ? (
            <img
              src={files[currentFileIndex].file_url}
              alt="Fullscreen Preview"
              style={{
                maxWidth: aspectRatio > 1 ? '80vw' : 'auto',
                maxHeight: aspectRatio <= 1 ? '90vh' : 'auto',
                objectFit: 'contain',
                cursor: 'grab',
              }}
              draggable="true"
            />
          ) : (
            isVideo(files[currentFileIndex]) && (
              <video
                src={files[currentFileIndex].file_url}
                controls
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                  cursor: 'grab',
                }}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default EditPostFileUpload;
