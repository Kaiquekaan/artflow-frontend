import React from 'react'
import { useEffect, useState, useRef, } from 'react';
import ListPost from '../../components/Feed/ListPost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faMagnifyingGlass, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import SkeletonPost from '../../components/Feed/SkeletonPost';

function HashtagPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q');
  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const querySearch = (q) => {
    setSearchQuery(q);
    console.log('search: ',searchQuery)
    navigate(`/t?q=${encodeURIComponent(q)}`);
};
    useEffect(() => {
    setIsLoading(true)
    setQuery(q || "");
    querySearch(q)
    let timeout;
    timeout = setTimeout(() => {
      setIsLoading(false);
  }, 300);
}, [location, q]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    setQuery(q || "");
    querySearch(q)
}, [location]);

useEffect(() => {
  const updateHeaderWidth = () => {
    if (headerRef.current && containerRef.current) {
      headerRef.current.style.width = `calc(${containerRef.current.offsetWidth}px - 1px)`;
      headerRef.current.style.left = `${containerRef.current.getBoundingClientRect().left}px`;
    }
  };

  // Ajusta a largura ao montar o componente e ao redimensionar a janela
  updateHeaderWidth();
  window.addEventListener('resize', updateHeaderWidth);

  return () => {
    window.removeEventListener('resize', updateHeaderWidth);
  };
  
     // Cria um observer para monitorar mudanças de tamanho no container
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
        navigate(`/t?q=${encodeURIComponent(query)}`);
    };

    const handleBack = () =>{
    navigate(`/explore`);
    }


    return(
     <div ref={containerRef} className='feed-container explore'>
      <div ref={headerRef}  className='explore-header-container'>
        <div className='explore-title'> <button onClick={handleBack}><FontAwesomeIcon icon={faArrowLeft} /></button>Explore</div>
        <form onSubmit={handleSearch}>
          <input type="text"  placeholder='Pesquisar' onChange={(e) => setQuery(e.target.value)}/>
          <button type='submit'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        </form>
      </div>
      {isLoading && Array.from({ length: 5 }).map((_, index) => <div className={`post-pag `}> <SkeletonPost key={index} /></div>)}

      {!isLoading && <ListPost endpoint={'/api/posts/explore/'} query={searchQuery} method={'GET'}/>}
      </div>
    )
}

export default HashtagPage;
