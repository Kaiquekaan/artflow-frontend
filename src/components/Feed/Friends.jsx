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



  if (loading) {
    return <div>Loading...</div>;
  }


    // Função para filtrar amigos offline
    if (!data || !data.userdata.friends) {
      return <div>Loading...</div>;
    }
  

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
                <img src={friend.profile_picture_url} alt="" className='friends-list-img' />
                <p>{friend.username} </p>
                </div>
                <div className='online-indicator'></div>
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
                <img src={friend.profile_picture_url} alt="" className='friends-list-img'/>
                <p>{friend.username}</p>
                </div>
                <div className='offline-indicator'></div>
                </li>
            ))}
          </ul>
        ) : (
          <p>No offline friends</p>
        )}
      </div>
      </div>
      </div>
    </div>
    )
}

export default Friends