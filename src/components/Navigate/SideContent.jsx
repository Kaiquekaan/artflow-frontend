import React from 'react'
import { useEffect, useState, useRef, } from 'react';
import {  useNavigate } from 'react-router-dom';
import api from '../../api';
import './SideContent.css'
import Friends from '../Feed/Friends';
import WhatNew from '../Feed/WhatNew';
import HighlightedPosts from '../Perfil/HighlightedPosts';
import RecommendedProfiles from '../Perfil/RecommendedProfiles';

function SideContent({page, data}) {
  const navigate = useNavigate();
  const sideContentRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [isNotebook, setIsNotebook] = useState(false);


  useEffect(() => {
    // Detecta se o dispositivo é um notebook considerando largura de até 1680px
    const checkIfNotebook = () => {
      const width = window.innerWidth;
      setIsNotebook(width >= 768 && width <= 1680);
    };

    // Inicializa a verificação e atualiza ao redimensionar a tela
    checkIfNotebook();
    window.addEventListener('resize', checkIfNotebook);

    return () => {
      window.removeEventListener('resize', checkIfNotebook);
    };
  }, []);

  useEffect(() => {
    // Aplica o efeito de scroll apenas se for notebook e se o Profile-div estiver presente
    if (!isNotebook) return;

    const mainContainer = document.querySelector('.main-container');
    const profileDiv = document.querySelector('.Profile-div');
    
    if (!profileDiv) return; // Sai se Profile-div não está presente na página

    const handleScroll = () => {
      const scrollPosition = mainContainer.scrollTop;
      if (scrollPosition > 100) {
        setOffset(Math.min(scrollPosition - 100, 100));
      } else {
        setOffset(0);
      }
    };

    mainContainer.addEventListener('scroll', handleScroll);
    return () => {
      mainContainer.removeEventListener('scroll', handleScroll);
    };
  }, [isNotebook]);

  const handleLogoClick = () => {
    navigate(`/`);
  };


    return(
      <>
       <div
                className={`Logo-container`}
                onClick={() => handleLogoClick()}
            >
                 <a className="sidebar-brand"><img src='https://raw.githubusercontent.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/feature-login/src/imagens/Af_logo_mini.webp' alt="Logo"  /> </a>
                 <a className="sidebar-brand"><img src='https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/master/src/imagens/artflow_written.png?raw=true' alt="Logo"  /> </a>
          </div>
     <div className='sidecontent-container' style={{ transform: `translateY(-${offset}px)` }}>
           
          <div className='sidecontent-content'>
          {page === 'feed' && (
            <>
             <Friends/>
             <WhatNew/>
            </>
          )}
          {page === 'profile' && (
            <>
             <HighlightedPosts username={data}/>
             <RecommendedProfiles username={data}/>
            </>
          )}
             
          </div>
      </div>
      </>
    )
}

export default SideContent