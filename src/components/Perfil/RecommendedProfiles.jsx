import React from 'react';
import {  useState, useEffect,  } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, } from 'react-router-dom';
import api from '../../api';

const RecommendedProfiles = ({ username }) => {
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ['recommendedProfiles', username],
        queryFn: async () => {
            if(username){
                const { data } = await api.get(`/api/profile/${username}/recommended-profiles/`);
               
                return data;
            }
        },
        enabled: !!username,
        staleTime: 60000,
        cacheTime: 300000, 
        refetchOnWindowFocus:false,
        refetchOnMount: false,
    });

    const [followingStatus, setFollowingStatus] = useState({});

    // Atualiza o estado inicial de "seguindo" quando os dados são carregados
    useEffect(() => {
        if (data) {
            const initialStatus = data.reduce((acc, user) => {
                acc[user.userdata.user_id] = user.is_following;
                return acc;
            }, {});
            setFollowingStatus(initialStatus);
        }
    }, [data]);

    const handleFollowToggle = async (userId) => {
        try {
            await api.post(`/api/follow-toggle/${userId}/`); // Endpoint de seguir/deixar de seguir

            // Atualiza o estado local após a resposta do servidor
            setFollowingStatus((prevState) => ({
                ...prevState,
                [userId]: !prevState[userId],
            }));
        } catch (error) {
            console.error("Erro ao seguir/deixar de seguir o usuário:", error);
        }
    };
    
    

    if (isLoading) return <div className="recommended-profiles-container">
    <div className='recommended-title'><p>Suggested Profiles</p></div>
    <div className='recommended-profile-content'>
    {Array.from({ length: 4 }).map((_, index) => <div  className="recommended-profile loading" >
            <div className='recommended-profile-overlay'></div>
            <div className='recommended-profile-main'>
            <div  alt="Profile" className='rounded-circle  recommended-profile-img loading'/>
            <div className='recommended-profile-p loading'><div></div></div>
            </div>
            <div className='btn-recommended-profile-container'>
            </div>
            </div>)}
        </div>
    </div>;


    if (error) return <div className="recommended-profiles-container">
    <div className='recommended-title'><p>Suggested Profiles</p></div>
    <div className='recommended-profile-content'>
    {Array.from({ length: 4 }).map((_, index) => <div  className="recommended-profile loading" >
            <div className='recommended-profile-overlay'></div>
            <div className='recommended-profile-main'>
            <div  alt="Profile" className='rounded-circle  recommended-profile-img loading'/>
            <div className='recommended-profile-p loading'><div></div></div>
            </div>
            <div className='btn-recommended-profile-container'>
            </div>
            </div>)}
        </div>
    </div>;;

    console.log('profiles vindo: ', data)


    const handleProfileClick = (username) => {
        navigate(`/profile/${username}/postagens`);
      };

    return (
        <div className="recommended-profiles-container">
            <div className='recommended-title'><p>Suggested Profiles</p></div>
            <div className='recommended-profile-content'>
            {data?.map((user) => (
                <div key={user.id} className="recommended-profile" onClick={() => handleProfileClick(user.username)} style={{backgroundImage: `url(${user?.userdata.banner_picture_url || ''})`,
                                                         backgroundSize: 'cover',    
                                                         backgroundPosition:'center',}}>
                    <div className='recommended-profile-overlay'></div>
                    <div className='recommended-profile-main'>
                    <div className='img-recommended-profile'>
                    <img src={user.userdata.profile_picture_url} alt="Profile" className='rounded-circle  recommended-profile-img'/>
                    </div>
                    <div className='recommended-user-info'> 
                        <div className='recommended-profile-p'>{user.userdata.displayname || user.username}</div>
                        <div className='recommended-profile-span'>{user.userdata.user_tag}</div>
                        </div>
                    </div>
                    <div className='btn-recommended-profile-container'>
                    <button 
                                className={`btn-white recommended-profile-btn ${followingStatus[user.userdata.user_id] ? 'following' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Impede a navegação ao clicar no botão
                                    handleFollowToggle(user.userdata.user_id);
                                }}
                            >
                                {followingStatus[user.userdata.user_id] ? 'Seguindo' : 'Seguir'}
                            </button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default RecommendedProfiles;
