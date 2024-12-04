import React, { useState, useEffect, useRef, useContext, } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faThumbsUp, faHeart, faMessage, faShare, faEllipsis, faShareNodes,   faArrowUpFromBracket,  faMinus, faChevronDown, faCircleXmark, faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';
import { faHeart as HeartResgular, faMessage as CommentRegular, faThumbsUp as LikeRegular } from '@fortawesome/free-regular-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import SkeletonPost from './SkeletonPost';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import CustomVideoPlayer from './CustomVideoPlayer';
import PostDetailModal from './PostDetailModal';
import { UserContext } from '../../Context/UserContext';
import NewPost from '../NewPost';
import { Link } from 'react-router-dom';
import api from '../../api';
import './PostPage.css'

function PostViewPage() {
    const { postId } = useParams();  // ID do post da URL
    const headerRef = useRef(null);
    const containerRef = useRef(null);
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const {data: userData } = useContext(UserContext);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); 
    const [activeDropdownPostId, setActiveDropdownPostId] = useState(null);
    const navigate = useNavigate();
    const toggleButtonRef = useRef(null);
    const dropdownRef = useRef(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [postToEdit, setPostToEdit] = useState(null);
    const [showEditPost, setShowEditPost] = useState(false);
    const [comment, setComment] = useState('');
    const commentInputRef = useRef(null);
    const [comments, setComments] = useState(post ? post.comments : []);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replyVisible, setReplyVisible] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null); // ID do comentário em edição
    const [editedContent, setEditedContent] = useState('');
   

    useEffect(() => {
        const fetchPostData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/post/${postId}/`);
                setPost(response.data);
            } catch (error) {
                console.error('Erro ao carregar o post:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (postId) fetchPostData();
    }, [postId]);

    console.log('Post na view: ', post)

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

      const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
          const response = await api.get(`/api/posts/${post.id}/comments/`);
          setComments(response.data); // Armazena os comentários carregados
        } catch (error) {
          console.error('Erro ao carregar comentários:', error);
        } finally {
          setIsLoadingComments(false); // Finaliza o carregamento
        }
      };

      console.log('comentarios do post: ', comments)

      useEffect(() => {
        if ( post) {
          fetchComments();
        }
    }, [ post]);

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

    const openPostDetail = (post, mediaIndex = 0, forceOpen = false) => {

        if (post.media_files.length === 0) {
          setSelectedMediaIndex(0);
          setIsModalOpen(true);
          return;
        }
  
        const clickedFile = post.media_files[mediaIndex];
        const fileExtension = clickedFile.file.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
      
        // O modal só abre se for uma imagem ou se for clicado diretamente no botão de chat (forceOpen = true)
        if (!isVideo || forceOpen) {
          setSelectedMediaIndex(mediaIndex); // Define a mídia que foi clicada
          setIsModalOpen(true); // Abre o modal
        }
      };

    const handleBack = () => {
        navigate(-1);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link do post copiado para a área de transferência!");
    };


    const handleOpenEditPost = (post) => {
        setPostToEdit(post);
        setShowEditPost(true);
        setActiveDropdownPostId(null);
      };

      const handleEditClick = (comment) => {
        setEditingCommentId(comment.id); 
        setEditedContent(comment.content);
        setActiveDropdownPostId(null);
      };
  

      const handleOpenDeleteModal = (postId) => {
        setPostToDelete(postId);
        setIsDeleteModalOpen(true);
        setActiveDropdownPostId(null);
      };


    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeletePost = async () => {
        try {
            await api.delete(`/api/posts/${postId}/`);
            navigate('/feed');
        } catch (error) {
            console.error('Erro ao deletar o post:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
      try {
        await api.delete(`/api/comments/${commentId}/`);
        const updatedComments = comments.filter((comment) => comment.id !== commentId);
        setComments(updatedComments);
      } catch (error) {
        console.error("Erro ao deletar o comentário:", error);
      }
    };

    const handleSaveEdit = async (commentId) => {
      try {
        await api.put(`/api/comments/${commentId}/`, { content: editedContent });
        const updatedComments = comments.map((comment) =>
          comment.id === commentId ? { ...comment, content: editedContent } : comment
        );
        setComments(updatedComments); // Atualiza os comentários no estado
        setEditingCommentId(null); // Sai do modo de edição
      } catch (error) {
        console.error("Erro ao salvar a edição:", error);
      }
    };

  const handleCancelEdit = () => {
    setEditingCommentId(null); // Sai do modo de edição sem salvar
    setEditedContent(''); // Limpa o conteúdo editado
  };

    const handleLikePost = async () => {
        if (!post) return;
        setPost((prevPost) => ({
            ...prevPost,
            has_liked: !prevPost.has_liked,
            likes_count: prevPost.has_liked ? prevPost.likes_count - 1 : prevPost.likes_count + 1,
        }));
        try {
            await api.post(`/api/posts/${postId}/like/`);
        } catch (error) {
            console.error('Erro ao curtir o post:', error);
        }
    };

    const handleFavoritePost = async () => {
        if (!post) return;
        setPost((prevPost) => ({
            ...prevPost,
            has_favorited: !prevPost.has_favorited,
            favorites_count: prevPost.has_favorited ? prevPost.favorites_count - 1 : prevPost.favorites_count + 1,
        }));
        try {
            await api.post(`/api/posts/${postId}/favorite/`);
        } catch (error) {
            console.error('Erro ao favoritar o post:', error);
        }
    };

    function collectReplies(replies) {
        const allReplies = [];
    
        const traverseReplies = (repliesArray) => {
            repliesArray.forEach(reply => {
                // Adiciona a resposta ao array
                allReplies.push(reply);
    
                // Se a resposta tem replies, chama a função recursivamente
                if (reply.replies && reply.replies.length > 0) {
                    traverseReplies(reply.replies);
                }
            });
        };
    
        traverseReplies(replies);
        console.log('lista de replys: ', allReplies)
        return allReplies;
    }


    function getCommentUser(post, replyingTo) {
        // Tenta encontrar o comentário pelo ID
        if (!post || !comments) return null;
        
        const comment = comments.find(c => c.id === replyingTo);
      
        // Se o comentário for encontrado, retorna o usuário
        if (comment) {
          return comment.user;
        }
      
        // Caso contrário, chama a função collectReplies para procurar nas respostas
        const allComments = collectReplies(post.comments);
        const replyComment = allComments.find(c => c.id === replyingTo);
      
        // Retorna o usuário da resposta, se encontrado
        return replyComment ? replyComment.user : null;
      }

      const toggleReplyVisibility = (commentId) => {
        setReplyVisible((prevState) => ({
          ...prevState,
          [commentId]: !prevState[commentId], // alterna a visibilidade das respostas
        }));
      };

      const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (replyingTo && replyContent) {
          try {
            const res = await api.post(`/api/comments/${replyingTo}/reply/`, { content: replyContent });
            const updatedComments = comments.map((comment) => {
              if (comment.id === replyingTo) {
                return {
                  ...comment,
                  replies: [...comment.replies, res.data], // Adiciona a nova resposta
                };
              }
              return comment;
            });
            setComments(updatedComments);
            setReplyContent(''); // Limpa o campo de resposta
            setReplyingTo(null); // Reseta o estado de resposta
          } catch (error) {
            console.error('Erro ao responder o comentário:', error);
          }
        } else if (comment) {
          try {
            const res = await api.post(`/api/posts/${post.id}/comment/`, { content: comment });
            const newComment = { 
              id: res.data.id,
              content: comment,
              user: userData.userdata.username,
              profile_picture_url: userData.userdata.profile_picture_url,
              likes_count: 0,
              created_at: new Date().toISOString(),
              has_liked: false,
              replies: [] // Inicialmente sem respostas
            };
            setComments([newComment, ...comments]); // Atualiza a lista de comentários localmente
            setComment(''); // Limpa o campo de comentário após o envio
          } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
          }
        }
      };

      const handleCommentLike = async (commentId) => {
        try {
          const res = await api.post(`/api/comments/${commentId}/like/`);
          const message = res.data.message;
          const likeAdded = message === 'Like added.';
      
          // Atualize os comentários e suas respostas
          const updatedComments = comments.map((comment) => {
            // Se for o comentário principal
            if (comment.id === commentId) {
              return {
                ...comment,
                has_liked: !comment.has_liked,
                likes_count: likeAdded ? comment.likes_count + 1 : comment.likes_count - 1,
              };
            }
      
            // Se o `comment` tiver `replies`, percorra e atualize qualquer reply com o `commentId` correspondente
            const updatedReplies = comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    has_liked: !reply.has_liked,
                    likes_count: likeAdded ? reply.likes_count + 1 : reply.likes_count - 1,
                  }
                : reply
            );
      
            return { ...comment, replies: updatedReplies };
          });
      
          setComments(updatedComments);
          console.log(updatedComments);
        } catch (error) {
          console.error('Erro ao curtir o comentário:', error);
        }
      };

      const handleCommentInput = (e) => {
        const target = e.target;
        target.style.height = 'auto'; 
        target.style.height = `${Math.min(target.scrollHeight, 128)}px`; 
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // Impede a nova linha
          handleCommentSubmit(e); // Envia o comentário ou resposta
        }
      };

      const handleBlur = () => {
        if (commentInputRef.current && commentInputRef.current.value === '') {
          commentInputRef.current.style.height = '2.5rem'; // Retorna à altura mínima ao perder o foco
        }
      };
      
      const handleReply = (commentId) => {
        setReplyingTo(commentId);
        setReplyContent(''); // Limpa o campo de resposta
      };
    

    const formatPostDate = (dateString) => {
        const date = parseISO(dateString);
        const distance = formatDistanceToNow(date, { addSuffix: true, locale: pt, includeSeconds: true });
        return distance.replace('aproximadamente ', '');
      };

      const closeModal = () => { 
        setSelectedMediaIndex(0);
        setIsModalOpen(false);  
      };

      const handleCancelEditPost = () => {
        setShowEditPost(false); 
      };

      const handleToggleItemDropdown = (postId) => {
        if (activeDropdownPostId === postId) {
          setActiveDropdownPostId(null); 
        } else {
          setActiveDropdownPostId(postId); 
        }
      };

      const handleProfileClick = (username) => {
        navigate(`/profile/${username}/postagens`);
      };
  

    return (
        <div ref={containerRef} className="post-view-container">
          <div ref={headerRef} className="post-view-header">
                <div className='post-view-header-title'><button onClick={handleBack}><FontAwesomeIcon icon={faArrowLeft} /></button> Post</div>
            </div>
            <div className='post-list'>
            <div className='post-pag'>
            {isLoading ? (
                    
                    <SkeletonPost />
                    
                ) : (
          
                   <>
                    {post && (
                        <div className="post-list-item">
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
                                <div className='post-list-item-content'>
                                <div className='post-list-item-header'>
                                <div
                                        className="d-flex align-items-center  link-dark text-decoration-none post-div-user"
                                        aria-expanded="false"
                                        >
                                <div className="user-info">
                                <div className='post-hader-info'>
                                    <p className="user-displayname mb-0">{post.user_displayname || post.user_username}</p>
                                    <p className='data-p'>{formatPostDate(post.created_at)} {post.last_edited_at && <span> (editado)</span>} </p> 
                                    </div>
                                    <p className="user-email mb-0">{post.user_tag}</p>
                                </div>
                                </div>
                                {!isLoading && (
                                    <div className='item-header'>
                                    <button className='btn-item-header' onClick={() => handleToggleItemDropdown(post.id)} ref={toggleButtonRef} >
                                    <FontAwesomeIcon icon={faEllipsis} />
                                    </button> 
                                    {activeDropdownPostId === post.id && (
                                      <div className='item-header-dropdown' ref={dropdownRef}>
                                        {userData?.userdata.user_id == post.user &&(
                                          <button onClick={() => handleOpenEditPost(post)}>Editar</button>
                                        )}
                                      <button>Denunciar</button>
                                      {userData?.userdata.user_id == post.user &&(
                                          <button onClick={() => handleOpenDeleteModal(post.id)}>Deletar</button>
                                        )}
                                    </div>
                                     )}
                                    </div>
                                )}
                                </div>  
                           
                            <div className="post-caption">
                            <p>{renderCaptionWithLinks(post.caption)}</p>  
                            </div>
                                {renderGallery(post)}
                                <div className='post-footer-container'>
                                <div className='post-item-footer'>
                                <div className={`post-item-btn ${post.has_liked ? 'liked' : ''}`}><button onClick={() => handleLikePost(post.id)}><FontAwesomeIcon icon={post.has_liked ? faThumbsUp : LikeRegular} /></button>{post.likes_count > 0 ? post.likes_count : ''}</div>
                                
                                <div className={`post-item-btn ${post.has_favorited ? 'favorited' : ''}`}><button onClick={() => handleFavoritePost(post.id)}><FontAwesomeIcon icon={post.has_favorited ? faHeart : HeartResgular} /></button>{post.favorites_count > 0 ? post.favorites_count : ''}</div>
                                
                                <div className='post-item-btn'><button onClick={() => openPostDetail(post, 0, true)}><FontAwesomeIcon icon={CommentRegular} /></button>{post.comments_count > 0 ? post.comments_count : ''}</div> 
                                
                                <div className='post-item-btn'><button><FontAwesomeIcon icon={faArrowUpFromBracket} /></button></div>
                                

                                </div>
                            </div>
                        </div>
                        </div>
                    )}
                    </>
               )}
               
        {!isLoading ? (
            <>
            <div className='modal-comment-add-container postpage'>
          {replyingTo && (
           <div className="reply-indicator">
              Responder<strong>{getCommentUser(post, replyingTo)} <button className='btn-close-reply' onClick={() => setReplyingTo(null)}><FontAwesomeIcon icon={faCircleXmark} /></button></strong>
              <FontAwesomeIcon icon={faArrowTurnDown} />
               
            </div>
            )}
            <div className='div-coment-input'>
            <img src={userData?.userdata.profile_picture_url} alt='user_picture' />
            <form onSubmit={handleCommentSubmit}  className="comment-form">

            <textarea
              ref={commentInputRef}
              value={replyingTo ? replyContent : comment}
              onChange={(e) => replyingTo ? setReplyContent(e.target.value) : setComment(e.target.value)}
              placeholder={replyingTo ? "Escreva sua resposta..." : "Escreva seu comentário..."}
              className="comment-input"
              onInput={handleCommentInput}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              required
            />

              
            </form>
            </div>
          </div>
          
            <div className="modal-comments postview">
            {/* Exibir comentários */}

            {isLoadingComments ? (
              <div className="loading-indicator comments">
              {/* Ou você pode colocar um spinner */}
              <div className="spinner"></div> 
            </div>
            ): comments?.length > 0 ? (
                <div className='comments-list'>
                 <p className='comments-list-title'>Comentarios <span>{post.comments_count}</span></p>   
                {comments.map((comment) => (
                <div key={comment.id} className="comment">  
                 <div className='comment-body'>
                <img src={comment.profile_picture_url} alt="comment-picture" className="comment-profile-pic" />
                <div className='comment-container'>
                <div className='comment-content'>
                <div className='comment-header'>
                <strong>{comment.user_tag ? comment.user_tag : comment.user}</strong>
                <div className='comment-date'>{formatPostDate(comment.created_at)} {comment.edited_at && <span> (editado)</span>}</div>
                </div>
                {editingCommentId === comment.id ? (
                        // Modo de edição
                        <div className='comment-text'>
                           <form
                            onSubmit={(e) => {
                              e.preventDefault(); // Evita o recarregamento da página
                              handleSaveEdit(comment.id); // Salva a edição ao enviar o formulário
                            }}
                            className='form-edit-comment'
                          >
                            <textarea
                              value={editedContent}
                              className='edit-textarea'
                              onChange={(e) => setEditedContent(e.target.value)}
                              onInput={(e) => {
                                e.target.style.height = "auto"; // Reseta a altura antes de ajustar
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`; // Ajusta até um limite de 160px (10rem)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault(); // Evita a nova linha
                                  handleSaveEdit(comment.id); // Salva a edição
                                }
                              }}
                            />
                            <div className='btns-form-edit-comment'>
                            <button type="submit" className='btn-form-edit-comment'>Salvar</button>
                            <button type="button" className='btn-form-edit-comment' onClick={handleCancelEdit}>Cancelar</button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        // Exibição normal do comentário
                        <div className='comment-text'>
                        
                        {comment.content}</div>
                      )}
                
                <div className='comment-btns-div'>
                <button onClick={() => handleCommentLike(comment.id)} className={`comment-item-btn ${comment.has_liked ? 'liked' : ''}`}><FontAwesomeIcon icon={comment.has_liked ? faThumbsUp : LikeRegular} /></button>
                <span>{` ${comment.likes_count > 0 ? comment.likes_count : ''}`}</span>
                <button><FontAwesomeIcon icon={CommentRegular} /></button>
                <span>{` ${comment.replies.length > 0 ? comment.replies.length : ''}`}</span>
                
                <div className='comment-div-reponse'>
                
                <button onClick={() => handleReply(comment.id)}>Responder</button>
               
                </div>
                
                </div>
                <div className='comment-response-div'>
                <button className='btn-repostas gridpage' onClick={() => toggleReplyVisibility(comment.id)}>
                {replyVisible[comment.id] ? <FontAwesomeIcon icon={faMinus} /> :  <FontAwesomeIcon icon={faChevronDown} />} Respostas ({collectReplies(comment.replies).length})
                </button>
                </div>
                </div>
               
                </div>
                <div className='item-header'>
                <button className='btn-comment-menu' onClick={() => handleToggleItemDropdown(comment.id)} ref={toggleButtonRef}><FontAwesomeIcon icon={faEllipsis} /></button>
                {activeDropdownPostId === comment.id && (
                                      <div className='item-header-dropdown' ref={dropdownRef}>
                                        {userData?.userdata.username == comment.user &&(
                                          <button onClick={() => handleEditClick(comment)}>Editar</button>
                                        )}
                                      <button>Denunciar</button>
                                      {userData?.userdata.username == comment.user &&(
                                          <button onClick={() => handleDeleteComment(comment.id)}>Deletar</button>
                                        )}
                                    </div>
                                     )}
                                </div>
                 </div>
                 {replyVisible[comment.id] && (
                <div className={`replies-container ${replyVisible[comment.id] ? 'show' : ''}`}>
                <div className="replies">
               { collectReplies(comment.replies).map((reply) => (
                <div key={reply.id} className="comment reply">
                  <div className="reply-img">
                    <img src={reply.profile_picture_url} alt={reply.user} className="reply-profile-pic" />
                  </div>
                  <div className='comment-container reply'>
                  <div className='comment-content'>
                  <div className='comment-header'> 
                  <strong>{reply.user_tag ? reply.user_tag : reply.user}</strong>
                  <div className='comment-date'>{formatPostDate(reply.created_at)} {reply.edited_at && <span> (editado)</span>}</div>
                  </div>

                  {editingCommentId === reply.id ? (
                        // Modo de edição
                        <div className='comment-text'>
                           <form
                            onSubmit={(e) => {
                              e.preventDefault(); // Evita o recarregamento da página
                              handleSaveEdit(reply.id); // Salva a edição ao enviar o formulário
                            }}
                            className='form-edit-comment'
                          >
                            <textarea
                              value={editedContent}
                              className='edit-textarea'
                              onChange={(e) => setEditedContent(e.target.value)}
                              onInput={(e) => {
                                e.target.style.height = "auto"; // Reseta a altura antes de ajustar
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`; // Ajusta até um limite de 160px (10rem)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault(); // Evita a nova linha
                                  handleSaveEdit(reply.id); // Salva a edição
                                }
                              }}
                            />
                            <div className='btns-form-edit-comment'>
                            <button type="submit" className='btn-form-edit-comment'>Salvar</button>
                            <button type="button" className='btn-form-edit-comment' onClick={handleCancelEdit}>Cancelar</button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        // Exibição normal do comentário
                        <div className='comment-text'>
                        {reply.parent_user != comment.user_tag &&(
                          <span>{reply.parent_user }</span>
                        )}
                        
                         {reply.content}</div>
                      )}
                  
                 
                  <div className='comment-btns-div'>
                  <button onClick={() => handleCommentLike(reply.id)} className={`comment-item-btn ${reply.has_liked ? 'liked' : ''}`}><FontAwesomeIcon icon={reply.has_liked ? faThumbsUp : LikeRegular} /></button>
                   <span>{` ${reply.likes_count > 0 ? reply.likes_count : ''}`}</span>
                  <button><FontAwesomeIcon icon={CommentRegular} /></button>
                 <span>{` ${reply.replies.length > 0 ? reply.replies.length : ''}`}</span>
                  <div className='comment-div-reponse'>
                  <button onClick={() => handleReply(reply.id)}>Responder</button>
           
                </div>
                </div>
                  </div>
                  </div>
                       
                  <div className='item-header'>
                  <button className='btn-comment-menu'><FontAwesomeIcon icon={faEllipsis} onClick={() => handleToggleItemDropdown(reply.id)} ref={toggleButtonRef}/></button>
                  {activeDropdownPostId === reply.id && (
                                      <div className='item-header-dropdown' ref={dropdownRef}>
                                         {userData?.userdata.username == reply.user &&(
                                          <button onClick={() =>  handleEditClick(reply)}>Editar</button>
                                        )}
                                      <button>Denunciar</button>
                                      {userData?.userdata.username == reply.user &&(
                                          <button onClick={() => handleDeleteComment(reply.id)}>Deletar</button>
                                        )}
                                    </div>
                                     )}
                                </div>  
                </div>
              ))}
            </div>
                </div>
                )}
                 </div>
                 ))}
                 </div>
            ) : ( 
                <div className='modal-comments-none'>
                 <p>Nenhum comentário ainda.</p> 
                 </div>
                 )}
          </div>
          </>
           ) : ( <div>

           </div> )}
           

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onRequestClose={handleCloseDeleteModal}
                onConfirm={handleDeletePost}
            />

        {showEditPost &&(
          <NewPost user={userData} onCancel={handleCancelEditPost} route={`/api/posts/${postToEdit.id}/`} postToEdit={postToEdit} />
        )}

            <PostDetailModal post={post} initialImageIndex={selectedMediaIndex} isOpen={isModalOpen} onClose={closeModal} />
        </div>
    </div>
   </div> 
    );
}

export default PostViewPage;
