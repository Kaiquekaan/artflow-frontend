import React, {  useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient,  useInfiniteQuery, } from '@tanstack/react-query';
import ListPost from '../../components/Feed/ListPost';
import debounce from 'lodash.debounce';
import CustomVideoPlayer from '../../components/Feed/CustomVideoPlayer';
import CustomVideoPreview from '../../components/Feed/CustomVideoPreview';
import PostDetailModal from '../../components/Feed/PostDetailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Navigate/Sidebar';
import api from '../../api';
import './GridPages.css';
import SkeletonGridItem from './SkeletonGridItem';


const fetchPosts = async ({ pageParam = 1, queryKey }) => {
    const [, { endpoint, query }] = queryKey;
    const url = query 
      ? `${endpoint}?query=${encodeURIComponent(query)}&page=${pageParam}`
      : `${endpoint}?page=${pageParam}`;
    
    const res = await api.get(url);

    console.log('esta vindo: ', res)
    return res.data;
  };

const GridPage = ({endpoint, section}) => {
    const [data, setData] = useState(null);
    const [query, setQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [recommendedTopics, setRecommendedTopics] = useState([]);
    const [activeSidebarSection, setActiveSidebarSection] = useState(section || 'feed');
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(section || 'cflow');
    
        
    const { data: posts, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
      queryKey: ['posts', { endpoint, query: searchQuery }], 
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const url = new URL(lastPage.next);
        return url.searchParams.get('page');
      },
      staleTime: 30000,  // Dados são considerados frescos por 30 segundos
      cacheTime: 600000, // Os dados permanecem em cache por 10 minutos após ficarem obsoletos
      refetchOnWindowFocus: false, // Refetch ao focar na janela
      refetchOnMount: false,
    });

    

    const [selectedPost, setSelectedPost] = useState(null);  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); 

    useEffect(() => {
        if (posts) {
          setData(posts);
          setIsLoading(false);
          
        }
      }, [posts]);




      useEffect(() => {
        const fetchRecommendedTopics = async () => {
          try {
            const res = await api.get('/api/posts/recommended-topics/');
            setRecommendedTopics(res.data.recommended_topics || []); // Garantindo um array
          } catch (error) {
            console.error("Erro ao carregar tópicos recomendados:", error);
            setRecommendedTopics([]); // Definindo como array vazio se houver erro
          }
        };
        fetchRecommendedTopics();
      }, []);
  
      useEffect(() => {
        const mainContainer = document.querySelector('.main-container'); // Seleciona o elemento correto

      
        const handleScroll = () => {
          if (mainContainer.scrollTop + mainContainer.clientHeight >= mainContainer.scrollHeight - 20 ) {
            fetchNextPage(); // Chama a próxima página
          }
        };
      
        mainContainer.addEventListener('scroll', handleScroll);
      
        return () => {
          mainContainer.removeEventListener('scroll', handleScroll);
        };
      }, [fetchNextPage]);

      useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

      
        const handleWheel = (e) => {
          if (scrollContainer) {
            e.preventDefault(); // Impede o scroll vertical da página
            scrollContainer.scrollLeft += e.deltaY; // Scrolla horizontalmente no container
          }
        };
    
        scrollContainer.addEventListener('wheel', handleWheel);
    
        return () => {
          scrollContainer.removeEventListener('wheel', handleWheel);
        };
      }, []);
      
      useEffect(() => {
        // Captura o parâmetro `q` da URL
        const params = new URLSearchParams(location.search);
        const urlQuery = params.get('q') || '';
        setSearchQuery(urlQuery);
        setQuery(urlQuery);
    }, [location.search]);

      
const openPostDetail = (post, mediaIndex = 0, forceOpen = false) => {

    if (post.media_files.length === 0) {
      setSelectedPost(post);
      setSelectedMediaIndex(0);
      setIsModalOpen(true);
      return;
    }

    const clickedFile = post.media_files[mediaIndex];
    const fileExtension = clickedFile.file.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
  
    // O modal só abre se for uma imagem ou se for clicado diretamente no botão de chat (forceOpen = true)
    if (!isVideo || forceOpen) {
      setSelectedPost(post); // Define a postagem selecionada
      setSelectedMediaIndex(mediaIndex); // Define a mídia que foi clicada
      setIsModalOpen(true); // Abre o modal
    }
  };

  const handlePostDetail = (post_id, mediaIndex = 0) => {
    navigate(`/cflow/view?p=${post_id}&i=${mediaIndex}`);
   
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(query);  // Atualize `searchQuery` com o valor da pesquisa atual
    navigate(`/cflow/?q=${encodeURIComponent(query)}`);
};

const handleTopicClick = (topic) => {
  setQuery(topic);
  setSearchQuery(topic); // Adiciona isso para disparar a busca
};

 

  console.log('Post: ', posts)

  const closeModal = () => {
    setSelectedPost(null);  // Reseta a postagem selecionada
    setSelectedMediaIndex(0); // Reseta o índice da mídia
    setIsModalOpen(false);  // Fecha o modal
  };

  const renderMediaFile = (file, post) => {
    const fileExtension = file.file.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
  

    if (isImage) {
      return <img key={file.file_url} src={file.file_url} alt="Post Media" className="post-item-img" />;
    } else if (isVideo) {
      return (
        <CustomVideoPreview key={post.id} videoUrl={file.file_url} postId={post.id} />
      );
    }
    return null;
  };

  const renderPostItem = (post) => {
    if (!post.media_files || post.media_files.length === 0) return null;
  
    return (
      <div className="post-item-container" key={post.id}>
        {post.media_files.map((file, index) => (
          <div
            className="post-item gallery"
            key={file.file_url}
            onClick={() => handlePostDetail(post.id, index)}
          >
            {renderMediaFile(file, post)}
            
          </div>
        ))}
      </div>
    );
  };

  const handleSidebarSectionChange = (newSection) => {
    setActiveSidebarSection(newSection);
    navigate(`/${newSection}`);
  };

  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    navigate(`/${newSection}`);
  };
  

return <div className='body'>

<div className='content-area'>
    <div className="container-fluid">
        <div className="row">
            <main className="main">
                <div className="main-container">
                <div className="col-3 main-div collum">
                <Sidebar sectionChange={handleSidebarSectionChange}  activeSection={activeSection}/>
                <div className='main-content'>  
                  <div className='gallery-page-list'>

    <div className='gallery-header-container'>
    <form onSubmit={handleSearch} className="gallery-search-form">
          <input 
            type="text"
            placeholder="Pesquisar"
            className="gallery-search-bar"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className='gallry-btn-submit'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        </form>  
       <div className='gallery-header-btns' ref={scrollContainerRef}>
        
        <button className='gallery-btn actived' onClick={() => handleTopicClick()}>Pagina inicial</button>
        {recommendedTopics.map((topic) => (
            <button 
              key={topic}
              className="gallery-btn"
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </button>
          ))}  
       </div>
    </div>
      <div className="gallery-grid">
      {isLoading && Array.from({ length: 30 }).map((_, index) => (
                          <SkeletonGridItem key={index} />
                        ))}

      {!isLoading &&
       data?.pages.map((page) =>
      page.results.map((post) => renderPostItem(post))
    )}

    {isFetchingNextPage && Array.from({ length: data?.pages[data?.pages.length - 1].next_count }).map((_, index) => (
                          <SkeletonGridItem key={index} />
                        ))}
  </div>

  {isModalOpen && selectedPost && (
    <PostDetailModal post={selectedPost} initialImageIndex={selectedMediaIndex} isOpen={isModalOpen}  onClose={closeModal} />
  )}

  

</div>
</div> 
</div> 
                 </div> 
                 </main>
                 </div> 
                 </div> 
                 </div> 
               
                 </div> 
};

export default GridPage;