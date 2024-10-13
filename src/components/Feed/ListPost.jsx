  import React, { useState, useEffect } from 'react';
  import { useInfiniteQuery,  } from '@tanstack/react-query';
  import api from '../../api';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import {faThumbsUp, faMessage, faShareNodes,  faEllipsis, faHeart, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
  import { formatDistanceToNow, parseISO } from 'date-fns';
  import { pt } from 'date-fns/locale';
  import CustomVideoPlayer from './CustomVideoPlayer';
  import PostDetailModal from './PostDetailModal';
  

  const fetchPosts = async ({ pageParam = 1, queryKey }) => {
    const [, { endpoint }] = queryKey;

      const res = await api.get(`${endpoint}?page=${pageParam}`);
      return res.data;
    

  };

  const ListPost = ({ endpoint, style }) => {
    const [data, setData] = useState(null);
    
    const { data: posts, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
      queryKey: ['posts', { endpoint }],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const url = new URL(lastPage.next);
        return url.searchParams.get('page');
      },
    });

    const [selectedPost, setSelectedPost] = useState(null);  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); 
   
    useEffect(() => {
      console.log("isFetchingNextPage:", isFetchingNextPage);
      console.log("hasNextPage:", hasNextPage);
  }, [isFetchingNextPage, hasNextPage]);

  
    useEffect(() => {
      if (posts) {
        setData(posts);
      }
    }, [posts]);

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
  

  
    const closeModal = () => {
      setSelectedPost(null);  // Reseta a postagem selecionada
      setSelectedMediaIndex(0); // Reseta o índice da mídia
      setIsModalOpen(false);  // Fecha o modal
    };

    console.log('esta vindo', data);
    
    const formatPostDate = (dateString) => {
      const date = parseISO(dateString);
      const distance = formatDistanceToNow(date, { addSuffix: true, locale: pt, includeSeconds: true });
      return distance.replace('aproximadamente ', '');
    };


    const renderMediaFile = (file) => {
      const fileExtension = file.file.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
      const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
    

      if (isImage) {
        return <img key={file.file_url} src={file.file_url} alt="Post Media" className="post-item-img" />;
      } else if (isVideo) {
        return (
          <CustomVideoPlayer
          key={file.file_url}
          src={file.file_url}
          type={`video/${fileExtension}`}
        />
        );
      }
      return null;
    };


    const getClassForGallery = (mediaLength) => {
      switch (mediaLength) {
        case 1:
          return 'one-image';
        case 2:
          return 'two-images';
        case 3:
          return 'three-images';
        case 4:
          return 'four-images';
        default:
          return 'more-images';  // Para 5 a 10 imagens
      }
    };


    const addComment = async (postId, content) => {
      const res = await api.post(`/api/posts/${postId}/comment/`, { content });
      return res.data;
    };

    const handleLikePost = async (postId) => {

      if (!data) return;
      // Encontre o post que foi curtido
      const updatedPages = data.pages.map(page => ({
        ...page,
        results: page.results.map(post => {
          if (post.id === postId) {
            // Atualize o estado local do post de forma otimista
            return {
              ...post,
              has_liked: !post.has_liked,
              likes_count: post.has_liked ? post.likes_count - 1 : post.likes_count + 1
            };
          }
          return post;
        })
      }));
    
      // Atualize o estado local do post na interface
      setData(prevData => ({ ...prevData, pages: updatedPages }));
    
      // Depois, faça a requisição ao backend
      try {
        await api.post(`/api/posts/${postId}/like/`);
      } catch (error) {
        console.error('Erro ao curtir a postagem:', error);
      }
    };

    const handleFavoritePost = async (postId) => {
      // Atualize o estado de forma otimista
      const updatedPages = data.pages.map(page => ({
        ...page,
        results: page.results.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              has_favorited: !post.has_favorited,
              favorites_count: post.has_favorited ? post.favorites_count - 1 : post.favorites_count + 1
            };
          }
          return post;
        })
      }));
    
      setData(prevData => ({ ...prevData, pages: updatedPages }));
    
      // Envie a requisição ao backend
      try {
        await api.post(`/api/posts/${postId}/favorite/`);
      } catch (error) {
        console.error('Erro ao favoritar a postagem:', error);
      }
    };
  
    const handleCommentSubmit = async (postId, content) => {
      try {
        const newComment = await addComment(postId, content);
        console.log('Comentário adicionado:', newComment);
      } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
      }
    };


    
    


    const renderGallery = (post) => {
      if (post.media_files.length === 3) {
        // Estrutura específica para 3 mídias
        return (
          <div className="media-gallery three-images">
            <div className="media-column">
              <div className="media-overlay" onClick={() => openPostDetail(post, 0)}>
                {renderMediaFile(post.media_files[0])} {/* Primeira mídia */}
              </div>
              <div className="media-overlay" onClick={() => openPostDetail(post, 1)}>
                {renderMediaFile(post.media_files[1])} {/* Segunda mídia */}
              </div>
            </div>
            <div className="large-media media-overlay" onClick={() => openPostDetail(post, 2)}>
              {renderMediaFile(post.media_files[2])} {/* Terceira mídia */}
            </div>
          </div>
        );
      }
    
      // Layout padrão para outros números de mídias
      return (
        <div className={`media-gallery ${getClassForGallery(post.media_files.length)}`}>
          {post.media_files.slice(0, 4).map((file, index) => (
            <div key={file.id} className="media-overlay" onClick={() => openPostDetail(post, index)}>
              {renderMediaFile(file)}
              {index === 3 && post.media_files.length > 4 && (
                <div className="more-count">
                  <div className="more-count-number">+{post.media_files.length - 4}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };

    const handleNextMedia = () => {
      if (selectedPost && selectedMediaIndex < selectedPost.media_files.length - 1) {
        setSelectedMediaIndex(selectedMediaIndex + 1);
      }
    };
  
    const handlePreviousMedia = () => {
      if (selectedPost && selectedMediaIndex > 0) {
        setSelectedMediaIndex(selectedMediaIndex - 1);
      }
    };

    return (
      <div className='post-list'>
        {data?.pages.map((page, pageIndex) => (
          <div key={pageIndex} className={`post-pag ${style ? style : ''}`}>
            {page.results.map((post) => (
              <div key={post.id} className={`post-list-item ${style ? style : ''}`}>
                <div className='post-img'>
                <img
              src={post.profile_picture} //user.usedata.profile_picture_url
              alt="mdo"
              width={25} // tamanho adequado para ser mais visível
              height={25}
              className="rounded-circle me-2  post-profile-img" // Adiciona margem à direita
              />
                </div>
                <div className='post-list-item-content' >
                <div className='post-list-item-header'>
                <div
                className="d-flex align-items-center  link-dark text-decoration-none post-div-user"
                aria-expanded="false"
                >
            
          <div className="user-info">
            <div className='post-hader-info'>
              <p className="user-displayname mb-0">{post.user_displayname ? post.user_displayname : post.user_username}</p>
              <p className='data-p'>{formatPostDate(post.created_at)}</p> 
              </div>
              <p className="user-email mb-0">{post.user_tag}</p>
          </div>
          
        </div>
                {/* Ajuste para exibir o campo "caption" */}
                 {/* Exibindo a data de criação */}
                <div className='item-header'>

                  
                  
                </div>
                </div>
                <div className='post-caption'>
              <p>{post.caption}</p>  
              </div>
                {renderGallery(post)}
                <div className='post-footer-container'>
              <div className='post-item-footer'>
              <div className={`post-item-btn ${post.has_liked ? 'liked' : ''}`}><button onClick={() => handleLikePost(post.id)}><FontAwesomeIcon icon={faThumbsUp} /></button>{post.likes_count > 0 ? post.likes_count : ''}</div>
              
              <div className={`post-item-btn ${post.has_favorited ? 'favorited' : ''}`}><button onClick={() => handleFavoritePost(post.id)}><FontAwesomeIcon icon={faHeart} /></button>{post.favorites_count > 0 ? post.favorites_count : ''}</div>
              
              <div className='post-item-btn'><button onClick={() => openPostDetail(post, 0, true)}><FontAwesomeIcon icon={faMessage} /></button>{post.comments_count > 0 ? post.comments_count : ''}</div> 
             
              <div className='post-item-btn'><button><FontAwesomeIcon icon={faArrowUpFromBracket} /></button></div>
              

              </div>
              </div>
                </div>
                <div>
                
                </div>
              </div>
            ))}
          </div>
        ))}

    {isFetchingNextPage && (
      <div className="loading-indicator">
       {/* Ou você pode colocar um spinner */}
       <div className="spinner"></div> 
     </div>
    )}
      
      {!hasNextPage && isFetchingNextPage == false && (
      <div className="no-more-posts">
       <p>Você já viu todos os posts!</p>
      </div>
      )}

        <PostDetailModal post={selectedPost} initialImageIndex={selectedMediaIndex} isOpen={isModalOpen} onClose={closeModal} />
      </div>
    );
  };

  export default ListPost;
