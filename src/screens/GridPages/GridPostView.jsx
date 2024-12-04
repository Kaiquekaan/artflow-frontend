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
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Navigate/Sidebar';
import api from '../../api';
import './GridPages.css';
import SkeletonGridItem from './SkeletonGridItem';
import { useMemo } from 'react';
import GridItens from './GridItens';







const GridPostView = ({endpoint, section}) => {
    const [data, setData] = useState(null);
    const [query, setQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSidebarSection, setActiveSidebarSection] = useState(section || 'feed');
    const navigate = useNavigate();
    const location = useLocation();
    const postId = new URLSearchParams(location.search).get('p');
    const index = new URLSearchParams(location.search).get('i');
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState(section || 'cflow');
    const [selectedPost, setSelectedPost] = useState(null);  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); 

    useEffect(() => {
      setIsLoading(true)
      let timeout;
        if (postId) {
            // Define o tempo mínimo de exibição da barra (por exemplo, 300 ms)
            timeout = setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }

        // Limpa o timeout para evitar que a barra continue ativa se o postId mudar rápido demais
        return () => clearTimeout(timeout);
  }, [postId]);


      
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
    navigate(`/${post_id}`);
   
  }



 



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
            onClick={() => openPostDetail(post, index)}
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

  

return <div className='body'>

<div className='content-area'>
    <div className="container-fluid">
        <div className="row">
            <main className="main">
                <div className="main-container">
                {isLoading && <div className="loading-bar"></div>}
                <div className="col-3 main-div collum">
                <Sidebar sectionChange={handleSidebarSectionChange}  activeSection={activeSection}/>
                <div className='main-content'>  
                  <div className='gallery-page-list gridpage'>

    <div className='gallery-post-container'>
   
    <GridPostModal postId={postId ? postId : ''} isOpen={true}  initialImageIndex={index} onClose={closeModal} />
  
    </div>
    <div>
    <div className='griditens-title'>
    Descubra Mais
    </div>
    {postId && (
 <GridItens />
    )}
     </div>
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

export default GridPostView;