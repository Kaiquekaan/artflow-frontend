import React from 'react'
import { useEffect, useState, useRef,  } from 'react';
import api from '../../api';
import { useNavigate, useLocation } from 'react-router-dom';
import ListPost from './ListPost';
import SkeletonPost from './SkeletonPost';
import './Feed.css'

function Feed() {
    const navigate = useNavigate();
    const location = useLocation();
    const headerRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab') || "friends";

    const [activeTab, setActiveTab] = useState(tabParam);

    const handleTabChange = (tab) => {
      setIsLoading(true)
      setActiveTab(tab);
      const mainContainer = document.querySelector('.main-container');// Mostra a barra de carregamento
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
      let timeout;
      timeout = setTimeout(() => {
        setIsLoading(false);
    }, 300);
      navigate(`/feed?tab=${tab}`);
      
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
  
}, [location]);

useEffect(() => {
  const updateHeaderWidth = () => {
    if (headerRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Ajusta a largura e posição do cabeçalho com base nas dimensões exatas do contêiner
      headerRef.current.style.width = `calc(${containerRect.width}px - 1px)`;
      headerRef.current.style.left = `${containerRect.left}px`;
    }
  };

  // Cria um observer para monitorar mudanças de tamanho no contêiner
  const resizeObserver = new ResizeObserver(updateHeaderWidth);

  // Observa o contêiner
  if (containerRef.current) {
    resizeObserver.observe(containerRef.current);
  }

  // Limpa o observer ao desmontar o componente
  return () => {
    resizeObserver.disconnect();
  };
}, []);

    const endpoint = activeTab === "friends" 
    ? "/api/posts/" 
    : "/api/posts/following/";

    return(
     <div ref={containerRef} className='feed-container'>
      <div ref={headerRef} className='feed-header-container'>
      <button 
        className={activeTab === "friends" ? 'selected' : ''}
        onClick={() => handleTabChange("friends")}
        >
        Ver Amigos
        </button>
        <button 
        className={activeTab === "following" ? 'selected' : ''}
        onClick={() => handleTabChange("following")}
        >
        Ver Seguindo
        </button>
      </div>
      {isLoading && Array.from({ length: 5 }).map((_, index) => <div className={`post-pag `}> <SkeletonPost key={index} /></div>)}

      {!isLoading && <ListPost endpoint={endpoint}  method={'GET'}/>}  
      </div>
    )
}

export default Feed