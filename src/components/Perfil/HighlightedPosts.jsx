import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import CustomVideoPreview from '../Feed/CustomVideoPreview';

const HighlightedMedia = ({ username }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: mediaFiles, isLoading, error } = useQuery({
        queryKey: ['highlightedMedia', username],
        queryFn: async () => {
            if(username){
                const { data } = await api.get(`/api/profile/${username}/highlighted-media/`);
                return data;
            }
        },
        enabled: !!username,
        staleTime: 60000,
        cacheTime: 300000, 
        refetchOnWindowFocus:false,
    });

    useEffect(() => {
        if (mediaFiles && mediaFiles.length > 6) {
            const interval = setInterval(() => {
                // Atualizar o índice inicial para o próximo conjunto de 6 mídias
                setCurrentIndex((prevIndex) => (prevIndex + 6) % mediaFiles.length);
            }, 3000); // Troca a cada 3 segundos
            return () => clearInterval(interval);
        }
    }, [mediaFiles]);

    if (isLoading) return <div className="highlighted-posts">
                 <div className='friends-list-title'>
                     Featured Posts
            </div>
            <div className="highlighted-media-gallery">
            {Array.from({ length: 6 }).map((_, index) => <div className={`highlighted-media-item loading `}> </div>)}
            </div>
        </div>;

    if (error) return <p>Error loading highlights</p>;

    // Determinar quais mídias exibir com base no índice atual
    let displayedMedia;
    if (mediaFiles && mediaFiles.length > 6) {
        // Se há mais de 6 mídias, exibe um conjunto rotativo de 6
        displayedMedia = [
            ...mediaFiles.slice(currentIndex, currentIndex + 6),
            ...mediaFiles.slice(0, Math.max(0, currentIndex + 6 - mediaFiles.length)), // Garantir 6 itens
        ];
    } else {
        // Caso contrário, exibe todas as mídias disponíveis
        displayedMedia = mediaFiles || [];
    }

    // Função para renderizar mídia (imagem ou vídeo)
    const renderMediaFile = (media) => {
        const fileExtension = media.file.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
        const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);

        if (isImage) {
            return <div className='highlighted-media-item-content'><img key={media.id} src={media.file_url} alt="Highlighted" className="highlighted-media-item" /></div>;
        } else if (isVideo) {
            return (
                <div className='highlighted-media-item-content'><CustomVideoPreview key={media.id} videoUrl={media.file_url} postId={media.post_id} style={'highlighted-media'}/>;</div>
            );
        }
        return null;
    };

    const handleViewPost = (username, postId) => {
        navigate(`/post/${username}/${postId}/view`) // Esconde o NewPost quando o cancelar é clicado
      };

      console.log('post do high: ', mediaFiles)


    return (
        <div className="highlighted-posts">
            <div className='friends-list-title'>
            Featured Posts
        </div>
        <div className="highlighted-media-gallery">
            {displayedMedia.length > 0 ? (
                <>
                {displayedMedia.map((media) => renderMediaFile(media))}
                </>
            ):(
                <>
                {Array.from({ length: 6 }).map((_, index) => <div className={`highlighted-media-item none `}> </div>)}
                <div className='none-item-highlighted'>Sem mídias</div>
                </>
            )}
            
        </div>
    </div>
    );
};

export default HighlightedMedia;