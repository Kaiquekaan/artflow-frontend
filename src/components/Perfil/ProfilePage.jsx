import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { UserContext } from '../../Context/UserContext';
import Sidebar from '../Navigate/Sidebar';
import Navigation from '../Navigate/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faUserGroup, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';
import SideContent from '../Navigate/SideContent';
import ListPost from '../Feed/ListPost';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import './ProfilePage.css';
import '../../screens/Home/Home.css';
import ProfileGallery from './ProfileGallery';
import ProfileEdit from '../../screens/Config/ProfileEdit';






const ProfilePage = ({ section }) => {
    const { username } = useParams(); // Certifica-se de capturar o userTag corretamente da URL
    const { data: userContextData } = useContext(UserContext); // Pega os dados do contexto do usuário logado
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [pendingRequest, setPendingRequest] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState(section || 'postagens');
    const [activeSidebarSection, setActiveSidebarSection] = useState(section || 'feed');
    const queryClient = useQueryClient();
    const [isDropDonwOpen, setIsDropDonwOpen] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);

   


    // Usa o useQuery para buscar os dados do perfil baseado no userTag capturado

    
  
    const fetchUserProfile  = async () => {
      try {
        const { data } = await api.post('/api/profile/', { username });
        if(data.message){
            return null
        }
        return data;
      } catch (error) {
        console.log(error)
      }
    };

   

    const { data, error, isLoading } = useQuery({
        queryKey: ['userProfile', username],
        queryFn: fetchUserProfile,
        retry: false,
        enabled: !!username,
        refetchOnWindowFocus:false,
        staleTime: 60000, // 1 minuto
        cacheTime: 300000, // Manter no cache por 5 minutos
    });

    useEffect(() => {
        if (data) {
            setIsFollowing(data.is_following);
            // Configure o estado de amizade baseado nos dados
            // Exemplo:
            setIsFriend(data.are_friends);
            setPendingRequest(data.pending_request_friend);
        }
    }, [data]);

    useEffect(() => {
        const currentSection = location.pathname.split('/').pop();
        setActiveSection(currentSection || 'postagens');
      }, [location]);


  /*  const followMutation = useMutation({
        mutationFn: async (userId) => {
            try {
                const { data } = await api.post(`/api/follow-toggle/${userId}/`);
                return data;
            } catch (error) {
                console.error('Erro ao seguir/parar de seguir:', error);
                throw error;
            }
        },
        onSuccess: (data) => {
            // Atualize o estado isFollowing com base na resposta da API
            setIsFollowing(data.status === 'Seguindo');
        },
        onError: (error) => {
            console.error('Erro ao atualizar follow status:', error);
        },
        onSettled: () => {
            // Revalidate a query do perfil para garantir que todos os dados estejam atualizados
            queryClient.invalidateQueries(['userProfile', username]);
        },
    }); */

    const handleFollowToggle = async () => {
        if (data?.user_id) {
            followUser(data.user_id);
        }
    };

   /* const { data: followersData, isLoading: isFollowersLoading, error: followersError } = useQuery({
        queryKey: ['followers', data?.user_id], // O user_id do usuário cujo perfil está sendo visualizado
        queryFn: () => fetchFollowers(data.user_id),
        enabled: !!data?.user_id, // Só executa a query se user_id estiver disponível
      });
*/ 
    console.log("Username: ", username);
    console.log("ProfileData: ", data);


    // Verifica se a requisição está carregando ou se houve um erro
    


    const addFriend = async (userId) => {
        try {
            const response = await api.post(`/api/send-friend-request/${userId}/`);
            if (response.data.status === 'Friend request accepted, now friends') {
                setIsFriend(true);
                setPendingRequest(false);
            } else if (response.data.status === 'Friendship removed') {
                setIsFriend(false);
            } else if (response.data.status === 'Friend request cancelled') {
                setPendingRequest(false);
            } else if (response.data.status === 'Friend request sent') {
                setPendingRequest(true);
            }
        } catch (error) {
            console.error(error.response.data.error);
        }
    };


    // Função para seguir usuário
    const followUser = async (userId) => {
        try {
            const response = await api.post(`/api/follow-toggle/${userId}/`);
            console.log(response.data.status)
            if (response.data.status.status == 'followed') {
                setIsFollowing(true);
            } else if (response.data.status.status == 'unfollowed') {
                setIsFollowing(false);
            }
        } catch (error) {
            console.error(error.response.data.error);
        }
    };

    


    // Verifica se o perfil é do usuário logado (usando userContextData para verificar se o usuário logado é o dono do perfil)
    const isOwner = userContextData?.username === data?.username;
    const renderContant = data?.is_locked 


    const handleSectionChange = (newSection) => {
        setActiveSection(newSection);
        navigate(`/profile/${username}/${newSection}`);
      };

      const handleSidebarSectionChange = (newSection) => {
        setActiveSidebarSection(newSection);
        navigate(`/${newSection}`);
      };



    const handleShowDropDown = () => {
        if(isDropDonwOpen){
            setIsDropDonwOpen(false);
        }else{
            setIsDropDonwOpen(true);
        }
       
    };

    const handleShowEditProfile = () => {
        if(showEditProfile){
            setShowEditProfile(false)
        }else{
            setShowEditProfile(true)
        }   
    };

    const handleCloseProfileEdit = () => {
        setShowEditProfile(false); 
      };


      const handleFeed = () => {
        navigate('/feed');
      };

    return (
        <div className='body'>

            <div className='content-area'>
                <div className="container-fluid">
                    <div className="row">
                        <main className="main">
                            <div className="main-container">
                            <div className="col-3 main-div profile">
                            
                            <Sidebar sectionChange={handleSidebarSectionChange} activeSection={activeSection}/>
                            <div className='main-content'>
                                <div className='Profile-div'>
                                    <div className='profile-container'>
                                        <div className='profile-contant'>
                                            <div className='profile-header'
                                             style={{ 
                                                backgroundImage: `url(${data?.banner_picture_url})`,
                                                backgroundSize: 'cover',    // Para cobrir toda a área
                                                backgroundPosition: 'center', // Centralizar a imagem
                                                backgroundColor: `${data?.banner_picture_url ? '#aaa' : '#39aee1'}`
                                              }}
                                            >
                                                <div className='achievement-container'></div>
                                            </div>
                                            <div className='profile-main'>
                                                <div className='profile-main-header' >
                                                    <div className='profile-pic-container'>
                                                    <div style={{
                                                         backgroundImage: `url(${data?.profile_picture_url || ''})`,
                                                         backgroundSize: 'cover',    // Para cobrir toda a área
                                                         backgroundPosition: 'center' // Centralizar a imagem
                                                    }} className='profile-user-pic' />
                                                    </div>  
                                                    <div className='profile-header-content'>
                                                    <div className='profile-user-info'>
                                                        <div
                                                            className="d-flex align-items-center  link-dark text-decoration-none profile"
                                                            id="dropdownUser3"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <div className={`user-info profile ${isLoading ? 'loading' : ''}`}>
                                                                {isLoading ? (<>
                                                                    <p className="user-displayname loading mb-0"></p>
                                                                    <p className="user-tag loading mb-0"></p>
                                                                </>):(
                                                                    <>
                                                                    <p className="user-displayname mb-0">{data?.displayname ? data?.displayname : data?.username}</p>
                                                                    <p className="user-tag mb-0">{data?.user_tag}</p>
                                                                    </>
                                                                )}
                                                                
                                                            </div>
                                                            <div className='user-info-itens'>
                                                            <div className='profile-user-info-btns'>
                                                                {!isLoading && (
                                                                       !isOwner ? (
                                                                            <>
                                                                              <button className={`btn-blue profile ${isFriend ? 'friend' : ''}`} onClick={() => addFriend(data.user_id)}>
                                                                                                                                                
                                                                                        {!isFriend ? (
                                                                                                    <>
                                                                                                      {pendingRequest ? (
                                                                                                                        <>
                                                                                                                                                    
                                                                                                                                                        <FontAwesomeIcon icon={faClock} /> <FontAwesomeIcon icon={faUserGroup} />
                                                                                                                                                        </>
                                                                                                                                                    ):(
                                                                                                                                                        <>
                                                                                                                                                        + <FontAwesomeIcon icon={faUserGroup} />
                                                                                                                                                        </>
                                                                                                                                                    )}
                                                                                                                                                    
                                                                                                                                                    </>
                                                                                                                                                ) : (
                                                                                                                                                    <>
                                                                                                                                                    <FontAwesomeIcon icon={faCheck} /> <FontAwesomeIcon icon={faUserGroup} />      
                                                                                                                                                </>
                                                                                                                                                )}
                                                                                                                                            </button>
                                                                                                                                            <button className={`btn-white profile ${isFollowing ? 'following' : ''}`} onClick={handleFollowToggle}>
                                                                                                                                            {isFollowing ? 'Seguindo' : 'Seguir'}
                                                                                                                                            </button>
                                                                                                                                        </>
                                                                                                                                    ):(
                                                                                                                                        <div>
                                                                                                                                            <button className={`btn-blue profile-edit`} onClick={handleShowEditProfile}>
                                                                                                                                                Editar Perfil
                                                                                                                                            </button>
                                                                                                                                        </div>
                                                                                                                                    )    
                                                                )}
 
                                                                </div>
                                                                <button className='btn-user-info' onClick={() => handleShowDropDown() }><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                                                               
                                                            </div>
                                                        </div>
                                                        <div className={`profile-bio ${isLoading ? 'loading' : ''}`}>
                                                            {isLoading ? (<>
                                                                <div></div>
                                                            </>):(
                                                                <>
                                                                <span>{data?.bio}</span>
                                                                </>
                                                            )}
                                                            
                                                        </div>
                                                    </div>
                                                            <div className='profile-main-header-2'>
                                                                <div className='profile-user-info-2'>
                                                                {isLoading ? (<>
                                                                </>):(
                                                                <>
                                                                <p><strong>{data?.posts_count}</strong>Postagens</p>
                                                                <p className='user-follows'><strong>{data?.followers_count}</strong>Seguidores</p>
                                                                <p className='user-follows'><strong>{data?.following_count}</strong>Seguindo</p>
                                                                <p className='user-friends'><strong>{data?.friends_count}</strong>Amigos</p> 
                                                                </>
                                                                )}
                                                                </div>
                                                               
                                                               
                                                            </div>
                                                            <div className='btns-profile-container'>
                                                            
                                                            </div>
                                                         </div>
                                                </div>
                                                
                                                <div className='profile-contant-main'>
                                                {!renderContant  ?(
                                                        <>
                                                    <div className='profile-contant-main-sections'>
                                                            <button 
                                                                className={`btn-profile ${activeSection === 'postagens' ? 'active' : ''}`} 
                                                                onClick={() => handleSectionChange('postagens')}
                                                            >
                                                                Postagens
                                                            </button>
                                                            <button 
                                                                className={`btn-profile ${activeSection === 'galeria' ? 'active' : ''}`} 
                                                                onClick={() => handleSectionChange('galeria')}
                                                            >
                                                                Galeria
                                                            </button>
                                                            
                                                            <button 
                                                                className={`btn-profile ${activeSection === 'curtidos' ? 'active' : ''}`} 
                                                                onClick={() => handleSectionChange('curtidos')}
                                                            >
                                                                Curtidos
                                                            </button>
                                                    </div>
                                                    
                                                     {activeSection === 'postagens' && data &&(
                                                    <ListPost endpoint={`/api/posts/user/${username}/`} method={'GET'} style={'profile'}/>
                                                    )}
                                                     { activeSection === 'galeria' && (
                                                     <ProfileGallery endpoint={`/api/posts/user/${username}/`} />
                                                    )}
                                                    
                                                    {activeSection === 'curtidos' && (
                                                    <ListPost endpoint={`/api/posts/${username}/favorites/`} method={'GET'} style={'profile'}/>
                                                    )}
                                                        </>
                                                    ): (
                                                       <div className='locked-container'>
                                                        <p>Este perfil é privado. Você não tem permissão para visualizar as postagens deste usuário.</p>
                                                        <button className='btn-blue' onClick={handleFeed}> Voltar ao Feed</button>
                                                       </div>
                                                    )}
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {isDropDonwOpen && (
                                    <>
                                    <div className='post-overlay'></div>
                                    <div className='menu-profile'>
                                     <button className='btn-menu-profile alt'>Denunciar</button>
                                     <button className='btn-menu-profile alt'>Bloquear</button>
                                     <button className='btn-menu-profile'>Compartilhar</button>
                                     <button onClick={() => handleShowDropDown()} className='btn-menu-profile'>Fechar</button>
                                    </div>
                                    </>
                                    )}
                                    {showEditProfile && (
                                        <>
                                      <div class="post-overlay"></div>
                                      <div className='profilepage-profileedit'>
                                        <ProfileEdit style={'profilepage'} parent={'profilepage'} onClose={handleCloseProfileEdit} parentQueryClient={queryClient} invalidate={'userProfile'}/>
                                     </div>
                                     </>
                                     )}
                                </div>
                                <div className='sidecontent-space profile'>
                                    <SideContent page={'profile'} data={data?.username}/>
                                </div>
                                </div>
                            </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
