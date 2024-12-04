import React, { useContext, useEffect, useState } from 'react';
import { useInfiniteQuery,  } from '@tanstack/react-query';
import CustomVideoPlayer from '../Feed/CustomVideoPlayer';
import PostDetailModal from '../Feed/PostDetailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-solid-svg-icons';


const fetchPosts = async ({ pageParam = 1, queryKey }) => {
    const [, { endpoint }] = queryKey;

      const res = await api.get(`${endpoint}?page=${pageParam}`);
      return res.data;
    

  };

const ProfileGallery = ({endpoint}) => {
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

      const renderPostItem = (post) => {
        if (!post.media_files || post.media_files.length === 0) return null;
    
        return (
          <div className="post-item gallery" key={post.id} onClick={() => openPostDetail(post)}>
            {renderMediaFile(post.media_files[0])} {/* Renderiza a primeira mídia */}
            {post.media_files.length > 1 && <span className="multiple-media-icon"><FontAwesomeIcon icon={faClone} /></span>}
          </div>
        );
      };

    return <>
          <div className="gallery-grid">
        {data?.pages.map((page) =>
          page.results.map((post) => renderPostItem(post))
        )}
      </div>

      {isModalOpen && selectedPost && (
        <PostDetailModal post={selectedPost} initialImageIndex={selectedMediaIndex} isOpen={isModalOpen}  onClose={closeModal} />
      )}

      {isFetchingNextPage && <p>Loading more...</p>}
    
    </>
};

export default ProfileGallery;