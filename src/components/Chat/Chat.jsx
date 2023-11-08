import React from 'react'
import './Chat.css'

import ChatBody from '../ChatBody'
import ChatFooter from '../ChatFooter'

const Chat = () => {
  return (
    <div className="chat">
      <ChatBody />
      <ChatFooter />
    </div>
  )
}

export default Chat