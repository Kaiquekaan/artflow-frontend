import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faExpand, faVolumeUp, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import './CustomVideoPlayer.css'
import SkeletonCustomVideo from './SkeletonCustomVideoPlayer';

const CustomVideoPlayer = ({ src, type, startWithVolume = false }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false); 
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [volume, setVolume] = useState(1);
  const [volumeTimeout, setVolumeTimeout] = useState(0);
  const [volumeControlsVisible, setVolumeControlsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [isMuted, setIsMuted] = useState(!startWithVolume);
  const controlsHideTimeout = useRef(null);

  useEffect(() => {
    const savedVolume = localStorage.getItem('videoVolume');
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    const ratio = videoElement.videoWidth / videoElement.videoHeight;
    setAspectRatio(ratio); // Atualiza a proporção do vídeo
  };

    // Efeito para monitorar o estado de fullscreen e ajustar estilos
    useEffect(() => {
      const handleFullscreenChange = () => {
        const isFullscreenActive = !!document.fullscreenElement;
        setIsFullscreen(isFullscreenActive);

        const isWideScreen = window.innerWidth > 1680;
        
        if (isFullscreenActive) {
          videoRef.current.style.maxHeight = 'none';
          videoRef.current.style.height = '100%';
          videoRef.current.style.width = 'auto';
          setIsMuted(false); // Desativa o mudo ao entrar no fullscreen
        } else {
          videoRef.current.style.maxHeight = isWideScreen ? '85vh' : '95vh';
          videoRef.current.style.width = '100%';
          setIsMuted(true); // Ativa o mudo ao sair do fullscreen, se necessário
        }
      };
  
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);


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

  useEffect(() => {
    if (!isMuted) {
      videoRef.current.volume = volume;
    }
    localStorage.setItem('videoVolume', volume);
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setShowPauseIcon(true);
      setTimeout(() => setShowPauseIcon(false), 1000);
    } else {
      videoRef.current.play();
      setShowPauseIcon(true);
      setTimeout(() => setShowPauseIcon(false), 1000);
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

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.parentNode.requestFullscreen();
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
    }, 2000)); // Espera 1 segundo antes de esconder
  };

  const handleVolumeButtonClick = () => {
    setIsMuted(!isMuted); // Alterna entre mutado e não mutado
    videoRef.current.muted = !isMuted;
  };

  const handleVolumeButtonMouseEnter = () => {
    setVolumeControlsVisible(true);
    clearTimeout(controlsHideTimeout.current); // Cancela o timeout ao entrar na barra de volume
  };

  const handleVolumeButtonMouseLeave = () => {
    controlsHideTimeout.current = setTimeout(() => {
      setControlsVisible(false);
      setVolumeControlsVisible(false);
    }, 3000); // Oculta os controles e a barra de volume após 3 segundos fora dela
  };


  const handleVolumeChange = (newVolume) => {
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };


  const handleVolumeClick = (e) => {
    setIsMuted(false)
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = clickX / rect.width;
    handleVolumeChange(newVolume);
  };


  const handleLoadedData = () => {
    setIsLoading(false); // Vídeo carregado, esconda o placeholder
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    clearTimeout(controlsHideTimeout.current);
    controlsHideTimeout.current = setTimeout(() => {
      if (!volumeControlsVisible) { // Verifica se o mouse não está sobre a barra de volume
        setControlsVisible(false);
      }
    }, 3000);
  };

 

  return (
    <div className="custom-video-player" style={{ backgroundColor: isFullscreen ? ' transparent' : '#1c1c1c'}}
    onMouseEnter={handleMouseEnter} // Evento para mostrar controles
    onMouseLeave={handleMouseLeave} 
    onMouseMove={handleMouseMove} 
    >
       {isLoading && (
        <SkeletonCustomVideo aspectRatio={aspectRatio}/>
      )}

         <video
        ref={videoRef}
        src={src}
        type={type}
        loop
        muted={isMuted}
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
       // Evento para esconder controles
        onLoadedData={handleLoadedData} 
        onLoadedMetadata={handleLoadedMetadata}
        className={`video-element ${isFullscreen ? '' : 'cover'}`}
        style={{ display: isLoading ? 'none' : 'block' }}
      ></video>

      {!isPlaying && showPauseIcon && (
        <div className="pause-icon-overlay">
          <FontAwesomeIcon icon={faPause} className="pause-icon" />
        </div>
      )}

      {isPlaying && showPauseIcon && (
        <div className="pause-icon-overlay">
          <FontAwesomeIcon icon={faPlay} className="pause-icon" />
        </div>
      )}

     {controlsVisible && ( // Renderiza os controles somente se estiver visível
        <div className="controls" onMouseEnter={handleMouseEnter} >
           <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className='controls-btns-container'>
            <div className='btns-right-area'>
          <button onClick={handlePlayPause} className='play-btn'>
            {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
          </button>
          </div>
          <div className='btns-left-area'>
          <button
              onMouseEnter={() => {
                setVolumeControlsVisible(true);
                hideVolumeControls(); // Reseta o timeout ao passar o mouse
              }}
              onMouseLeave={hideVolumeControls} // Esconder a barra de volume ao sair
              onClick={handleVolumeButtonClick} 
            className='volume-btn'
          >
            {!isMuted ? <FontAwesomeIcon icon={faVolumeUp} /> : <FontAwesomeIcon icon={faVolumeXmark} /> } 
          </button>
          {volumeControlsVisible && ( // Renderiza a barra de volume somente se estiver visível
            <div className="volume-container" onClick={handleVolumeClick}>
            <div className="volume-bar" style={{ width: `${isMuted ? 0 : volume * 100}%` }}></div>
          </div>
          )}
          <button onClick={toggleFullscreen} className='fullscreen-btn'>
            <FontAwesomeIcon icon={faExpand} />
          </button>
          </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default CustomVideoPlayer;
