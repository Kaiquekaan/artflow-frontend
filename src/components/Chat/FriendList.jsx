// FriendList.js
import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter as solidFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function FriendList({ onSelectFriend }) {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await api.get('/api/friends/');
                setFriends(response.data);
                console.log('friends-list:',response.data)
            } catch (error) {
                console.error('Erro ao carregar amigos:', error);
            }
        };
        fetchFriends();
    }, []);

    return (
        <div>
            <form action="" className='search-friend-list-form'>
                <input type="text" name="" id="" placeholder='Pesquisar'/>
                <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
            </form>
            <div className='friend-list-title'>Chats <button><FontAwesomeIcon icon={solidFilter} /></button></div>
            <div className='friend-list-itens'>
                {friends.map(friend => (
                    <div className='friend-list-item' key={friend.id} onClick={() => onSelectFriend(friend)}>
                    <div className='friend-list-item-img-container'>
                     <img src={friend.profile_picture_url} alt="user-pic" />
                    </div>
                    <div className='friend-list-item-text'>{friend.username}</div>
                    <div className='friend-list-item-time'>ha 7horas</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FriendList;
