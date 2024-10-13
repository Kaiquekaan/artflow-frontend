import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faExpand, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './CustomVideoPlayer.css'

const CustomVideoPlayer = ({ src, type }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [volume, setVolume] = useState(1);
  const [volumeTimeout, setVolumeTimeout] = useState(0);
  const [volumeControlsVisible, setVolumeControlsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(null);

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    const ratio = videoElement.videoWidth / videoElement.videoHeight;
    setAspectRatio(ratio); // Atualiza a proporção do vídeo
  };


  useEffect(() => {
    const videoElement = videoRef.current;

    // Função para pausar ou tocar o vídeo baseado na visibilidade
    const handleVisibility = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    };

    // Configuração do IntersectionObserver
    const observer = new IntersectionObserver(handleVisibility, {
      root: null, // Observa dentro da viewport
      rootMargin: '0px',
      threshold: 0.5, // Percentual de visibilidade necessário para ação
    });

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setProgress((currentTime / duration) * 100);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
        videoRef.current.style.maxHeight = '85vh';
      } else {
        videoRef.current.parentNode.requestFullscreen();
        setIsFullscreen(true);
        videoRef.current.style.maxHeight = 'none';
      }
    }
  };

  const handleMouseEnter = () => {
    setControlsVisible(true);
  };

  const handleMouseLeave = () => {
    setControlsVisible(false);
    hideVolumeControls();
  };

  const hideVolumeControls = () => {
    if (volumeTimeout) {
      clearTimeout(volumeTimeout); // Limpa o timeout anterior
    }
    setVolumeTimeout(setTimeout(() => {
      setVolumeControlsVisible(false);
    }, 1000)); // Espera 1 segundo antes de esconder
  };

  const handleVolumeButtonClick = () => {
    const newVolume = 0.5; // Metade do volume máximo
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setVolumeControlsVisible(true); // Mostra o controle de volume para visualização
    hideVolumeControls(); // Inicia o timeout para esconder o controle
  };


  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume; // Atualiza o volume do vídeo
    setVolume(newVolume);
  };




  const handleLoadedData = () => {
    setIsLoading(false); // Vídeo carregado, esconda o placeholder
  };

  return (
    <div className="custom-video-player">
       {isLoading && (
        <div className="media-placeholder" 
         style={{
          aspectRatio: aspectRatio || '16/9', // Usa a proporção obtida ou um padrão inicial
          height: '85vh', // Altura máxima como definido
          width: aspectRatio ? `calc(85vh * ${aspectRatio})` : '25vw', // Ajusta a largura com base na proporção
           // Cor de fundo para simular o vídeo carregando
        }}>
          Carregando...
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        type={type}
        loop
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onMouseEnter={handleMouseEnter} // Evento para mostrar controles
        onMouseLeave={handleMouseLeave} // Evento para esconder controles
        onLoadedData={handleLoadedData} 
        onLoadedMetadata={handleLoadedMetadata}
        className={`video-element ${isFullscreen ? '' : 'cover'}`}
        style={{ display: isLoading ? 'none' : 'block' }}
      ></video>
     {controlsVisible && ( // Renderiza os controles somente se estiver visível
        <div className="controls" onMouseEnter={handleMouseEnter} >
          <button onClick={handlePlayPause} className='play-btn'>
            {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
          </button>
          <input
            type="range"
            value={progress}
            onChange={handleSeek}
            className="progress-bar"
          />
          <button
              onMouseEnter={() => {
                setVolumeControlsVisible(true);
                hideVolumeControls(); // Reseta o timeout ao passar o mouse
              }}
              onMouseLeave={hideVolumeControls} // Esconder a barra de volume ao sair
              onClick={handleVolumeButtonClick} 
            className='volume-btn'
          >
            <FontAwesomeIcon icon={faVolumeUp} />
          </button>
          {volumeControlsVisible && ( // Renderiza a barra de volume somente se estiver visível
            <input
              type="range"
              value={volume}
              onChange={handleVolumeChange}
              onMouseEnter={() => setVolumeControlsVisible(true)} // Mostrar a barra de volume ao passar o mouse
              onMouseLeave={() => setVolumeControlsVisible(false)}
              className="volume-bar"
              min="0"
              max="1"
              step="0.01"
            />
          )}
          <button onClick={toggleFullscreen} className='fullscreen-btn'>
            <FontAwesomeIcon icon={faExpand} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
