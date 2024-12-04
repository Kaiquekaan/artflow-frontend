import React, {  useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient,  useInfiniteQuery, } from '@tanstack/react-query';
import ListPost from '../../components/Feed/ListPost';
import debounce from 'lodash.debounce';
import CustomVideoPreview from '../../components/Feed/CustomVideoPreview';
import GridPostModal from './GridPostModel';
import PostDetailModal from '../../components/Feed/PostDetailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate,} from 'react-router-dom';
import Sidebar from '../../components/Navigate/Sidebar';
import api from '../../api';
import './GridPages.css';
import SkeletonGridItem from './SkeletonGridItem';
import { useMemo } from 'react';



const fetchRecommendations = async ({ pageParam = 1, queryKey }) => {
  const [, { post_Id }] = queryKey;
    console.log('post id3 :', post_Id)
    const response = await api.get(`/api/posts/${post_Id}/recommendations/?page=${pageParam}`);
    console.log('resposta do post_id :', response.data)
    return response.data;
};


const GridItens = ({ section}) => {
    const postId = new URLSearchParams(location.search).get('p');
    const [data, setData] = useState(null);
    const [query, setQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSidebarSection, setActiveSidebarSection] = useState(section || 'feed');
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(section || 'cflow');
    const [isMounted, setIsMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    console.log("postId es:", postId); 

    const { data: recommendations, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['recommendations',  {post_Id: postId} ],
        queryFn: fetchRecommendations,
        getNextPageParam: (lastPage) => {
            if (!lastPage.next) return undefined;
            const url = new URL(lastPage.next);
            return url.searchParams.get('page');
        },
        staleTime: 30000,
        cacheTime: 600000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        enabled: isMounted && !!postId, // ativa quando postId é válido
    });

    

    const [selectedPost, setSelectedPost] = useState(null);  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); 

    useEffect(() => {
        if (recommendations) {
          setData(recommendations);
          setIsLoading(false);
          
        }
      }, [recommendations]);


  
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/cflow/view?p=${post_id}&i=${mediaIndex}`);
    
  }

 

  console.log('recommendations: ', recommendations)

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

  

return <div className="gallery-grid gridpage">
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

};

export default GridItens;