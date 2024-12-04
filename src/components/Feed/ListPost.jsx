  import React, { useState, useEffect, useContext,  useRef } from 'react';
  import { useInfiniteQuery,  } from '@tanstack/react-query';
  import api from '../../api';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import {faThumbsUp, faMessage, faShareNodes,  faEllipsis, faHeart, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
  import { faHeart as HeartResgular, faMessage as CommentRegular, faThumbsUp as LikeRegular } from '@fortawesome/free-regular-svg-icons';
  import { formatDistanceToNow, parseISO } from 'date-fns';
  import { pt } from 'date-fns/locale';
  import CustomVideoPlayer from './CustomVideoPlayer';
  import PostDetailModal from './PostDetailModal';
  import ConfirmDeleteModal from './ConfirmDeleteModal';
  import NewPost from '../NewPost';
  import { UserContext } from '../../Context/UserContext';
  import { Link } from 'react-router-dom';
  import SkeletonPost from './SkeletonPost';
  import { useNavigate } from 'react-router-dom';
  import ShareModal from './ShareModel';


  const fetchPosts = async ({ pageParam = 1, queryKey }) => {
    const [, { endpoint, query }] = queryKey;
    const url = query 
    ? `${endpoint}?query=${encodeURIComponent(query)}&page=${pageParam}`
    : `${endpoint}?page=${pageParam}`;
     const res = await api.get(url);
      return res.data;
  };

  const ListPost = ({ endpoint, query,  style }) => {
    const [data, setData] = useState(null);
    const {data: userData } = useContext(UserContext);
    const dropdownRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    
    const { data: posts, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
      queryKey: ['posts', { endpoint, query }],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const url = new URL(lastPage.next);
        return url.searchParams.get('page');
      },
      staleTime: 30000,  // Dados são considerados frescos por 30 segundos
      cacheTime: 600000, // Os dados permanecem em cache por 10 minutos após ficarem obsoletos
      refetchOnWindowFocus: true, // Refetch ao focar na janela
      refetchOnMount: false,
    });

    const [selectedPost, setSelectedPost] = useState(null);  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); 
    const [activeDropdownPostId, setActiveDropdownPostId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [postToEdit, setPostToEdit] = useState(null);
    const [showEditPost, setShowEditPost] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [currentShareLink, setCurrentShareLink] = useState('');
   
    useEffect(() => {
      console.log("isFetchingNextPage:", isFetchingNextPage);
      console.log("hasNextPage:", hasNextPage);
  }, [isFetchingNextPage, hasNextPage]);

  
    useEffect(() => {
      if (posts) {
        setData(posts);
        setIsLoading(false);
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

    useEffect(() => {
      if (selectedPost) {
        const updatedPost = data.pages
          .flatMap(page => page.results)
          .find(post => post.id === selectedPost.id);
    
        if (updatedPost) {
          setSelectedPost(updatedPost); // Atualiza o post selecionado
        }
      }
    }, [data, selectedPost]);

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

    const handleOpenDeleteModal = (postId) => {
      setPostToDelete(postId);
      setIsDeleteModalOpen(true);
      setActiveDropdownPostId(null);
    };
  
    const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    };
  
    const handleDeletePost = async () => {
     if (!postToDelete) return;

     try{
        const res = await api.delete(`/api/posts/${postToDelete}/`);
        setData(prevData => ({
          ...prevData,
          pages: prevData.pages.map(page => ({
            ...page,
            results: page.results.filter(post => post.id !== postToDelete),
          })),
        }));
      }catch(error){
        console.error('Erro na requisição:', error);
      }finally {
        handleCloseDeleteModal(); // Fechar o modal após a operação
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

    useEffect(() => {
      const handleClickOutside = (event) => {
        // Verifica se o clique foi fora do dropdown e do botão de toggle
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          toggleButtonRef.current &&
          !toggleButtonRef.current.contains(event.target)
        ) {
          setTimeout(() => {
            setActiveDropdownPostId(null); // Fecha o dropdown se o clique for fora
          }, 0); // Atraso de 0ms para garantir que o clique no botão não seja tratado
        }
      };
  
      // Adiciona o eventListener para o evento mouseup (que ocorre após mousedown)
      document.addEventListener('mouseup', handleClickOutside);
      
      // Remove o eventListener ao desmontar o componente
      return () => {
        document.removeEventListener('mouseup', handleClickOutside);
      };
    }, [dropdownRef, toggleButtonRef]);


 
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
  
    const handleToggleItemDropdown = (postId) => {
      if (activeDropdownPostId === postId) {
        setActiveDropdownPostId(null); 
      } else {
        setActiveDropdownPostId(postId); 
      }
    };

    const handleViewPost = (username, postId) => {
      navigate(`/post/${username}/${postId}/view`) // Esconde o NewPost quando o cancelar é clicado
    };


    const handleCancelEditPost = () => {
      setShowEditPost(false); // Esconde o NewPost quando o cancelar é clicado
    };

    const handleOpenEditPost = (post) => {
      setPostToEdit(post);
      setShowEditPost(true);
      setActiveDropdownPostId(null);
    };

    const renderCaptionWithLinks = (caption) => {
      const regex = /#([\wÀ-ÿ]+)/g; // RegEx para encontrar hashtags
      const parts = caption.split(regex); // Divide o caption em partes

      return parts.map((part, index) => {
          // Se a parte for uma hashtag, cria um link
          if (index % 2 === 1) {
              return (
                  <Link key={index} to={`/t?q=${encodeURIComponent(`#${part}`)}`}>
                      {`#${part}`} {/* Adiciona o '#' de volta */}
                  </Link>
              );
          }
          return part; // Retorna partes normais do texto
      });
  }
    
    


    const renderGallery = (post) => {
      const isVideo = post.media_files.some(file => {
        const fileExtension = file.file.split('.').pop().toLowerCase();
        return ['mp4', 'webm', 'ogg'].includes(fileExtension);
      });
      
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
        <div className={`media-gallery ${getClassForGallery(post.media_files.length)} ${isVideo ? 'video-content' : ''}`}>
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

    const handleProfileClick = (username) => {
      if(style == 'profile') return 
      navigate(`/profile/${username}/postagens`);
    };

    const handleSearch = (query) => {
      navigate(`/t/trending?q=${encodeURIComponent(query)}`);
  };

  const handleOpenShareModal = async (postId) => {
    try {
        // Faz a requisição ao backend para registrar o compartilhamento
        const response = await api.post(`/api/posts/${postId}/share/`);
        const shareLink = response.data.share_link;

        // Define o link no estado e abre o modal
        setCurrentShareLink(shareLink);
        setIsShareModalOpen(true);
    } catch (error) {
        console.error("Erro ao compartilhar o post:", error);
        alert("Não foi possível compartilhar o post. Tente novamente.");
    }
};

const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setCurrentShareLink('');
};
    

    return (
      <div className='post-list'>
         {isLoading && Array.from({ length: 5 }).map((_, index) => <div className={`post-pag ${style ? style : ''}`}> <SkeletonPost key={index} /></div>)}

        {!isLoading &&
          data?.pages.map((page, pageIndex) => (
          <div key={pageIndex} className={`post-pag ${style ? style : ''}`}>
            {page.results.map((post) => (
              <div key={post.id} className={`post-list-item ${style ? style : ''}`} onClick={(event) => {
                // Impede a navegação se o clique não for no próprio container
                if (
                  event.target.closest('.media-gallery') ||
                  event.target.closest('.post-list-item-header') ||
                  event.target.closest('.post-caption') ||
                  event.target.closest('.btn-open-profile') ||
                  event.target.closest('.post-footer-container')
                ) {
                  return;
                }
                handleViewPost(post.user_username, post.id);
              }}>
                <div className='post-img'>
                <button className='btn-open-profile' onClick={() => handleProfileClick(post.user_username)}>
                <img
              src={post.profile_picture} //user.usedata.profile_picture_url
              alt="mdo"
              width={25} // tamanho adequado para ser mais visível
              height={25}
              className="rounded-circle me-2  post-profile-img" // Adiciona margem à direita
              /></button>
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
              <p className='data-p'>{formatPostDate(post.created_at)} {post.last_edited_at && <span> (editado)</span>} </p> 
              </div>
              <p className="user-email mb-0">{post.user_tag}</p>
          </div>
          
        </div>
                {/* Ajuste para exibir o campo "caption" */}
                 {/* Exibindo a data de criação */}
                <div className='item-header'>
                <button className='btn-item-header' onClick={() => handleToggleItemDropdown(post.id)} ref={toggleButtonRef} >
                <FontAwesomeIcon icon={faEllipsis} />
                </button> 
                {activeDropdownPostId === post.id && (
                  <div className='item-header-dropdown' ref={dropdownRef}>
                    {userData.userdata.user_id == post.user &&(
                      <button onClick={() => handleOpenEditPost(post)}>Editar</button>
                    )}
                  <button>Denunciar</button>
                  {userData.userdata.user_id == post.user &&(
                      <button onClick={() => handleOpenDeleteModal(post.id)}>Deletar</button>
                    )}
                </div>
                )}
                </div>
                </div>
                <div className='post-caption'>
              <p>{renderCaptionWithLinks(post.caption)}</p>  
              </div>
                {renderGallery(post)}
                <div className='post-footer-container'>
              <div className='post-item-footer'>
              <div className={`post-item-btn ${post.has_liked ? 'liked' : ''}`}><button onClick={() => handleLikePost(post.id)}><FontAwesomeIcon icon={post.has_liked ? faThumbsUp : LikeRegular} /></button>{post.likes_count > 0 ? post.likes_count : ''}</div>
              
              <div className={`post-item-btn ${post.has_favorited ? 'favorited' : ''}`}><button onClick={() => handleFavoritePost(post.id)}><FontAwesomeIcon icon={ post.has_favorited ? faHeart : HeartResgular} /></button>{post.favorites_count > 0 ? post.favorites_count : ''}</div>
              
              <div className='post-item-btn'><button onClick={() => openPostDetail(post, 0, true)}><FontAwesomeIcon icon={CommentRegular} /></button>{post.comments_count > 0 ? post.comments_count : ''}</div> 
             
              <div className='post-item-btn'><button onClick={() => handleOpenShareModal(post.id)}><FontAwesomeIcon icon={faArrowUpFromBracket} /></button>{post.shares_count > 0 && <span>{post.shares_count}</span>}</div>
              

              </div>
              </div>
                </div>
                
              </div>
            ))}
          </div>
        ))}

    {/*{isFetchingNextPage && (
      <div className="loading-indicator">
     
       <div className="spinner"></div> 
     </div>
    )} */}

    {isFetchingNextPage && Array.from({ length: data?.pages[data?.pages.length - 1].next_count}).map((_, index) => <div className={`post-pag ${style ? style : ''}`}> <SkeletonPost key={index} /></div>)}
      
      {!hasNextPage && !isFetchingNextPage && !isLoading &&(
        <> 
          <div className="no-more-posts">
          <p>Você já viu todos os posts!</p>
          </div>  
        </>
       
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        onConfirm={handleDeletePost}
      />
        {showEditPost &&(
          <NewPost user={userData} onCancel={handleCancelEditPost} route={`/api/posts/${postToEdit.id}/`} postToEdit={postToEdit} />
        )}

        <ShareModal
                isOpen={isShareModalOpen}
                onClose={handleCloseShareModal}
                shareLink={currentShareLink}
            />
        

        <PostDetailModal post={selectedPost} initialImageIndex={selectedMediaIndex} isOpen={isModalOpen} onClose={closeModal} onLikePost={handleLikePost} onFavoritePost={handleFavoritePost}/>
      </div>
    );
  };

  export default ListPost;
