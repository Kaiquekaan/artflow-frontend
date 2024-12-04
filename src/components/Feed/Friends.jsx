import React from 'react'
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import api from '../../api';

function Friends() {
  const { data, onlineFriends } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get('/api/friends/');
        setFriends(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    if (onlineFriends) {
      console.log("Amigos online foram atualizados", onlineFriends);
    }
  }, [onlineFriends]);



  if (loading ) {
    return <div className='friends-container'>
    <div className='friends-list'>
    <div className='friends-list-title loading'>
       <p></p>
    </div>
   <div className='friends-list-content loading'>
  <div className='friends-list-itens loading'>
  <ul>  

  {Array.from({ length: !data ? 4 : data?.userdata.friends_count  }).map((_, index) => (
                         <li >
                         <div className='li-content loading'>
                         <div  alt="" className='friends-list-img loading' />
                         <p></p>
                         </div>
                         </li>
                        ))}
           
           
       </ul>
   
  </div>
  </div>
  </div>
</div>;
  }


    // Função para filtrar amigos offline
    
  

    console.log(friends);
    const onlineFriendsSet = new Set(onlineFriends.map(friend => friend.user_tag));

    // Amigos online e offline
    const onlineFriendsList = friends.filter(friend => onlineFriendsSet.has(friend.user_tag));
    const offlineFriendsList = friends.filter(friend => !onlineFriendsSet.has(friend.user_tag));

    return(
      <div className='friends-container'>
        <div className='friends-list'>
        <div className='friends-list-title'>
           Amigos
        </div>
       <div className='friends-list-content'>
        
        {onlineFriendsList.length > 0 ? (
          <ul>
            {onlineFriendsList.map(friend => (
              <li key={friend.user_tag}>
                <div className='li-content'>
                <div className='friend-img-container'>
                <button className='btn-open-profile-friend-list'>
                <img src={friend.profile_picture_url} alt="" className='friends-list-img' />
                <div className='online-indicator'></div>
                </button>
                </div>
                <p>{friend.username} </p>
                </div>
                </li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      

      <div className='friends-list'>
        
        {offlineFriendsList.length > 0 ? (
          <ul>
            {offlineFriendsList.map(friend => (
              <li key={friend.user_tag}>
                <div className='li-content'>
                  <div className='friend-img-container'>
                 <button className='btn-open-profile-friend-list'>
                 <img src={friend.profile_picture_url} alt="" className='friends-list-img'/> 
                 <div className='offline-indicator'></div>
                 </button>
                </div>
                <p>{friend.username}</p>
                </div> 
                </li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>
      </div>
      </div>
    </div>
    )
}

export default Friends