import React from 'react'
import { useEffect, useState, useRef, } from 'react';
import api from '../../api';
import ListPost from '../Feed/ListPost';
import './Explore.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faMagnifyingGlass, } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

function Explore({isQuery}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    setQuery(q || "");
     if(isQuery){
      querySearch(q)
     }
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

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(query);
        navigate(`/explore?q=${encodeURIComponent(query)}`);
    };

    const querySearch = (q) => {
      setSearchQuery(q);
      navigate(`/explore?q=${encodeURIComponent(q)}`);
  };


    return(
     <div ref={containerRef} className='feed-container explore'>
      <div ref={headerRef}  className='explore-header-container'>
        <div className='explore-title'>Explore</div>
        <form onSubmit={handleSearch}>
          <input type="text"  placeholder='Pesquisar' onChange={(e) => setQuery(e.target.value)}/>
          <button type='submit'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        </form>
      </div>
      <ListPost endpoint={'/api/posts/explore/'} query={searchQuery} method={'GET'}/>
      </div>
    )
}

export default Explore