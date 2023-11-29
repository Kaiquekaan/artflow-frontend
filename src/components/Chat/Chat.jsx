import React, { useEffect, useState } from 'react';
import './Chat.css';

const Chat = () => {
 useEffect(() => {
  if (window.botpressWebChat) {
  window.botpressWebChat.init({
    "composerPlaceholder": "Chat with bot",
    "botConversationDescription": "This chatbot was built surprisingly fast with Botpress",
    "botId": "a32b893b-5fc9-4f49-82e7-79f385318cb2",
    "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
    "messagingUrl": "https://messaging.botpress.cloud",
    "clientId": "a32b893b-5fc9-4f49-82e7-79f385318cb2",
    "webhookId": "86ab7835-1328-4dff-b1c2-cc2c02692676",
    "lazySocket": true,
    "themeName": "prism",
    "frontendVersion": "v1",
    "showPoweredBy": true,
    "theme": "prism",
    "themeColor": "#2563eb"
});
  }
}, [window.botpressWebChat]);
 
  return (
    <div>
      <div id="webchat" />
    </div>
  );
};

export default Chat;