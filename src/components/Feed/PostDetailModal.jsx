import React, { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faThumbsUp, faMessage, faEllipsis, faCircleXmark, faArrowTurnDown, faMinus, faHeart, faChevronDown, faArrowUpFromBracket, faExpand,} from '@fortawesome/free-solid-svg-icons';
import { faHeart as HeartResgular, faMessage as CommentRegular, faThumbsUp as LikeRegular } from '@fortawesome/free-regular-svg-icons';
import CustomVideoPlayer from './CustomVideoPlayer';
import { UserContext } from '../../Context/UserContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import ShareModal from './ShareModel';
import { Link } from 'react-router-dom';
import { pt } from 'date-fns/locale';
import api from '../../api';

const PostDetailModal = ({ post, initialImageIndex = 0, isOpen, onClose, onLikePost, onFavoritePost }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(initialImageIndex);
  const {data: userData } = useContext(UserContext);
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);
  const [comments, setComments] = useState(post ? post.comments : []);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyVisible, setReplyVisible] = useState({});
  const [replyingTo, setReplyingTo] = useState(null); // Estado para controlar a resposta
  const [editingCommentId, setEditingCommentId] = useState(null); // ID do comentário em edição
  const [editedContent, setEditedContent] = useState('');
  const toggleCommentButtonRef = useRef(null);
  const [activeDropdownPostId, setActiveDropdownPostId] = useState(null);
  const dropdownRef = useRef(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentShareLink, setCurrentShareLink] = useState('');


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

  useEffect(() => {
      if (isOpen && post) {
        fetchComments();
        setCurrentMediaIndex(initialImageIndex);
      }
  }, [isOpen, initialImageIndex, post]);

  useEffect(() => {
    if (isOpen && post && comment) {
      const sortedComments = [...comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setComments(sortedComments);
    }
  }, [isOpen, post]);

  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.style.height = '2.5rem'; // Define a altura inicial
    }
  }, [isOpen]);

  if (!isOpen || !post) return null;


  // Funções para navegação entre mídias
  const handleNext = () => {
    setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % post.media_files.length);
  };

  const handlePrevious = () => {
    setCurrentMediaIndex((prevIndex) => 
      prevIndex === 0 ? post.media_files.length - 1 : prevIndex - 1
    );
  };

  // Função para renderizar o arquivo de mídia (imagem ou vídeo)
  const renderMediaFile = (file) => {
    if(!file){
      return
    }
    const fileExtension = file.file.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);

    if (isImage) {
      return <img src={file.file_url} alt="Post Media" className="modal-media" />;
    } else if (isVideo) {
      return (
          <div className="modal-media-video" >
             <CustomVideoPlayer
              key={file.file_url}
              src={file.file_url}
             type={`video/${fileExtension}`}
             startWithVolume={true}
            />
     </div>
      );
    }
    return null;
  };



  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id); 
    setEditedContent(comment.content);
    setActiveDropdownPostId(null);
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

  const handleCommentInput = (e) => {
    const target = e.target;
    target.style.height = 'auto'; // Reseta a altura para calcular o novo valor
    target.style.height = `${Math.min(target.scrollHeight, 128)}px`; // Ajusta a altura para o conteúdo
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

  console.log('Comentarios do post: ', post.comments)


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

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyContent(''); // Limpa o campo de resposta
  };


  const formatPostDate = (dateString) => {
    const date = parseISO(dateString);
    const distance = formatDistanceToNow(date, { addSuffix: true, locale: pt, includeSeconds: true });
    return distance.replace('aproximadamente ', '');
  };


  const toggleReplyVisibility = (commentId) => {
    setReplyVisible((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId], // alterna a visibilidade das respostas
    }));
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
    return allReplies;
}

function formatComments(comments) {
  const commentMap = new Map();
  
  // Cria um mapa dos comentários com id como chave
  comments.forEach(comment => {
    commentMap.set(comment.id, {
      ...comment,
      userName: comment.user.name, // Nome do usuário do comentário
      replies: [] // Inicializa as replies como um array vazio
    });
  });

  // Preenche as replies e atribui o nome do usuário correto
  comments.forEach(comment => {
    if (comment.parent_comment_id !== null) {
      const parentComment = commentMap.get(comment.parent_comment_id);
      if (parentComment) {
        parentComment.replies.push({
          ...commentMap.get(comment.id),
          userName: parentComment.user.name // Nome do usuário do comentário pai
        });
      }
    }
  });

  // Retorna apenas os comentários principais (aqueles sem parent_comment_id)
  return Array.from(commentMap.values()).filter(comment => comment.parent_comment_id === null);
}


function getCommentUser(post, replyingTo) {

  if (!post || !comments) return null;

  // Tenta encontrar o comentário pelo ID
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

const handleLikePost = async () => {
  if (!post) return;

  // Atualize o estado local do post de forma otimista
  const updatedPost = {
    ...post,
    has_liked: !post.has_liked,
    likes_count: post.has_liked ? post.likes_count - 1 : post.likes_count + 1,
  };

  setPost(updatedPost); // Atualize o estado local do post exibido no modal

  // Envie a requisição ao backend
  try {
    await api.post(`/api/posts/${post.id}/like/`);
  } catch (error) {
    console.error('Erro ao curtir a postagem:', error);

    // Reverte o estado caso a requisição falhe
    setPost(post);
  }
};

const handleFavoritePost = async () => {
  if (!post) return;

  // Atualize o estado local do post de forma otimista
  const updatedPost = {
    ...post,
    has_favorited: !post.has_favorited,
    favorites_count: post.has_favorited
      ? post.favorites_count - 1
      : post.favorites_count + 1,
  };

  setPost(updatedPost); // Atualize o estado local do post exibido no modal

  // Envie a requisição ao backend
  try {
    await api.post(`/api/posts/${post.id}/favorite/`);
  } catch (error) {
    console.error('Erro ao favoritar a postagem:', error);

    // Reverte o estado caso a requisição falhe
    setPost(post);
  }
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

const handleToggleItemDropdown = (postId) => {
  if (activeDropdownPostId === postId) {
    setActiveDropdownPostId(null); 
  } else {
    setActiveDropdownPostId(postId); 
  }
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



  return (
    <div className="modal-overlay" onClick={(e) => {
      
      if (e.target.classList.contains('modal-overlay')) {
        onClose();
      }
    }}>
       <div className='modal-container'>
       <button className="modal-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      <div className='modal-btns-container'>
      <div className={`modal-item-btn ${post.has_liked ? 'liked' : ''}`}><button onClick={() => onLikePost(post.id)}><FontAwesomeIcon icon={post.has_liked ? faThumbsUp : LikeRegular} /></button><span>{post.likes_count > 0 ? post.likes_count : 'Like'}</span></div>
      <div className={`modal-item-btn ${post.has_favorited ? 'favorited' : ''}`}><button onClick={() => onFavoritePost(post.id)}><FontAwesomeIcon icon={ post.has_favorited ? faHeart : HeartResgular} /></button><span>{post.favorites_count > 0 ? post.favorites_count : 'Fav'}</span></div>
      <div className='modal-item-btn'><button onClick={() => handleOpenShareModal(post.id)}><FontAwesomeIcon icon={faArrowUpFromBracket} /></button>{post.shares_count > 0 ? <span>{post.shares_count}</span> : <span>Share</span> }</div>
      <div className='modal-item-btn '><button >
            <FontAwesomeIcon icon={faExpand} />
          </button>
          </div>
      </div>
      <div className={`modal-content ${post.media_files.length === 0 ? 'no-media' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={`modal-left ${post.media_files.length === 0 ? 'no-media' : ''}`}>
       
          {/* Botão de navegação para a mídia anterior */}
          <button className="modal-nav-btn left" onClick={handlePrevious}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Renderizar a mídia atual (imagem ou vídeo) */}
          {renderMediaFile(post.media_files[currentMediaIndex])}

          {/* Botão de navegação para a próxima mídia */}
          <button className="modal-nav-btn right" onClick={handleNext}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className={`modal-right ${post.media_files.length === 0 ? 'no-media' : ''}`}>
          <div className='model-header'>
          <div className="modal-user-info">
            <img
              src={post.profile_picture}
              alt="Profile"
              className="modal-profile-picture"
            />
            <div>
              <p className='modal-user-info-main-p'>{post.user_displayname ? post.user_displayname : post.user_username}</p>
              <p className='modal-user-info-tag-p'>{post.user_tag}</p>
            </div>
          </div>
          {post?.caption &&(
          <div className="modal-caption">
            <p>{renderCaptionWithLinks(post.caption)}</p>
          </div>
           )}
          </div>
          <div className="modal-comments">
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
                            <button type="submit" className='btn-form-edit-comment postdetail'>Salvar</button>
                            <button type="button" className='btn-form-edit-comment postdetail' onClick={handleCancelEdit}>Cancelar</button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        // Exibição normal do comentário
                        <div className='comment-text'>
                        
                        {comment.content}</div>
                      )}
                <div className='comment-btns-div'>
                <button onClick={() => handleCommentLike(comment.id)} className={`comment-item-btn ${comment.has_liked ? 'liked' : ''}`}><FontAwesomeIcon icon={ comment.has_liked ? faThumbsUp : LikeRegular} /></button>
                <span>{` ${comment.likes_count > 0 ? comment.likes_count : ''}`}</span>
                <button><FontAwesomeIcon icon={CommentRegular} /></button>
                <span>{` ${comment.replies.length > 0 ? comment.replies.length : ''}`}</span>
                
                <div className='comment-div-reponse'>
                
                <button onClick={() => handleReply(comment.id)}>Responder</button>
               
                </div>
                
                </div>
                <div className='comment-response-div'>
                <button className='btn-repostas' onClick={() => toggleReplyVisibility(comment.id)}>
                {replyVisible[comment.id] ? <FontAwesomeIcon icon={faMinus} /> :  <FontAwesomeIcon icon={faChevronDown} />} Respostas ({collectReplies(comment.replies).length})
                </button>
                </div>
                </div>
                </div>
                <div className='item-header'>
                <button className='btn-comment-menu' onClick={() => handleToggleItemDropdown(comment.id)} ref={toggleCommentButtonRef}><FontAwesomeIcon icon={faEllipsis} /></button>
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
                  <div className='comment-date'>{formatPostDate(reply.created_at)} {comment.edited_at && <span> (editado)</span>}</div>
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
                            <button type="submit" className='btn-form-edit-comment postdetail'>Salvar</button>
                            <button type="button" className='btn-form-edit-comment postdetail' onClick={handleCancelEdit}>Cancelar</button>
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
                  <button className='btn-comment-menu' onClick={() => handleToggleItemDropdown(reply.id)} ref={toggleCommentButtonRef}><FontAwesomeIcon icon={faEllipsis} /></button>
                  {activeDropdownPostId === reply.id && (
                                      <div className='item-header-dropdown postdetail' ref={dropdownRef}>
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
          <div className='modal-comment-add-container'>
          {replyingTo && (
           <div className="reply-indicator">
              Responder<strong>{getCommentUser(post, replyingTo)} <button className='btn-close-reply' onClick={() => setReplyingTo(null)}><FontAwesomeIcon icon={faCircleXmark} /></button></strong>
              <FontAwesomeIcon icon={faArrowTurnDown} />
               
            </div>
            )}
            <div className='div-coment-input'>
            <img src={userData.userdata.profile_picture_url} alt='user_picture' />
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
        </div>
      </div>
      </div>
      <ShareModal
                isOpen={isShareModalOpen}
                onClose={handleCloseShareModal}
                shareLink={currentShareLink}
            />
    </div>
  );
};

export default PostDetailModal;
