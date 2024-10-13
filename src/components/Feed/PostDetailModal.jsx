import React, { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faThumbsUp, faMessage, faEllipsis, faCircleXmark, faArrowTurnDown, faMinus, faPlus, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import CustomVideoPlayer from './CustomVideoPlayer';
import { UserContext } from '../../Context/UserContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import api from '../../api';

const PostDetailModal = ({ post, initialImageIndex = 0, isOpen, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(initialImageIndex);
  const { data: userContextData } = useContext(UserContext);
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);
  const [comments, setComments] = useState(post ? post.comments : []);
  const [replyContent, setReplyContent] = useState('');
  const [replyVisible, setReplyVisible] = useState({});
  const [replyingTo, setReplyingTo] = useState(null); // Estado para controlar a resposta


 

  useEffect(() => {
    if (isOpen) {
      setCurrentMediaIndex(initialImageIndex);  // Quando o modal abrir, define a mídia inicial
      if (post) {
        setComments(post.comments); // Atualiza os comentários quando o post mudar
      }
    }
  }, [isOpen, initialImageIndex, post]);

  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.style.height = '2.5rem'; // Define a altura inicial
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && post) {
      const sortedComments = [...post.comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setComments(sortedComments);
    }
  }, [isOpen, post]);

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
            />
     </div>
      );
    }
    return null;
  };



  const handleCommentChange = (e) => {
    setComment(e.target.value);
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
          user: userContextData.userdata.username,
          profile_picture_url: userContextData.userdata.profile_picture_url,
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
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, has_liked: !comment.has_liked, likes_count: res.data.likes_count } : comment
      );
      setComments(updatedComments);
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
  // Tenta encontrar o comentário pelo ID
  const comment = post.comments.find(c => c.id === replyingTo);

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



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${post.media_files.length === 0 ? 'no-media' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

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
              <p>{post.user_username}</p>
              <p>{post.user_tag}</p>
            </div>
          </div>
          <div className="modal-caption">
            <p>{post.caption}</p>
          </div>
          </div>
          <div className="modal-comments">
            {/* Exibir comentários */}
            {comments.length > 0 ? (
                <div className='comments-list'>
                 <p className='comments-list-title'>Comentarios <span>{post.comments_count}</span></p>   
                {comments.map((comment) => (
                <div key={comment.id} className="comment">  
                <img src={comment.profile_picture_url} alt="comment-picture" className="comment-profile-pic" />
                <div className='comment-container'>
                <div className='comment-content'>
                <div className='comment-header'>
                <strong>{comment.user}</strong>
                <div className='comment-date'>{formatPostDate(comment.created_at)}</div>
                </div>
                <span>{comment.content}</span>
                <div className='comment-btns-div'>
                <button onClick={() => handleCommentLike(comment.id)} className={`comment-item-btn ${comment.has_liked ? 'liked' : ''}`}><FontAwesomeIcon icon={faThumbsUp} /></button>
                <span>{` ${comment.likes_count > 0 ? comment.likes_count : ''}`}</span>
                <button><FontAwesomeIcon icon={faMessage} /></button>
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
                  <strong>{reply.user}</strong>
                  <div className='comment-date'>{formatPostDate(reply.created_at)}</div>
                  </div>
                  
                  <div className='comment-text'>
                    {reply.parent_user != comment.user &&(
                      <span>{reply.parent_user }</span>
                    )}
                    
                     {reply.content}</div>
                  <div className='comment-btns-div'>
                  <button onClick={() => handleCommentLike(reply.id)} className={`comment-item-btn ${reply.has_liked ? 'liked' : ''}`}><FontAwesomeIcon icon={faThumbsUp} /></button>
                   <span>{` ${reply.likes_count > 0 ? reply.likes_count : ''}`}</span>
                  <button><FontAwesomeIcon icon={faMessage} /></button>
                 <span>{` ${reply.replies.length > 0 ? reply.replies.length : ''}`}</span>
                  <div className='comment-div-reponse'>
                  <button onClick={() => handleReply(reply.id)}>Responder</button>
           
                </div>
                </div>
                  </div>
                  </div>
                  <button className='btn-comment-menu'><FontAwesomeIcon icon={faEllipsis} /></button>
                </div>
              ))}
            </div>
                </div>
                )}
                </div>
              
                <button className='btn-comment-menu'><FontAwesomeIcon icon={faEllipsis} /></button>
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
            <img src={userContextData.userdata.profile_picture_url} alt='user_picture' />
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
  );
};

export default PostDetailModal;
