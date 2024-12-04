
import React, { useEffect, useState } from 'react';
import FriendList from './FriendList';
import ChatWindow from './ChatWindow';
import './Chat.css'

const Chats = ({ isVisible }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

    return (
        <div className='chats-section'>
            <div className='side-list'>
                <FriendList onSelectFriend={setSelectedFriend} />
            </div>
            <div className='chat-container'>
                {selectedFriend ? (
                    <ChatWindow friend={selectedFriend} />
                ) : (
                    <p>Selecione um amigo para iniciar o chat</p>
                )}
            </div>
        </div>
    );
};

export default Chats;