
import React, { useEffect, useState } from 'react';

const Chatbot = ({ isVisible }) => {
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    setChatVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (chatVisible) {
      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.botpressWebChat.init({
          composerPlaceholder: "Chat with TaskBot",
          botConversationDescription: "TaskBot will help you with your tasks!",
          botId: "a32b893b-5fc9-4f49-82e7-79f385318cb2",
          hostUrl: "https://cdn.botpress.cloud/webchat/v1",
          messagingUrl: "https://messaging.botpress.cloud",
          clientId: "a32b893b-5fc9-4f49-82e7-79f385318cb2",
          webhookId: "86ab7835-1328-4dff-b1c2-cc2c02692676",
          lazySocket: true,
          themeName: "prism",
          botName: "TaskBot",
          frontendVersion: "v1",
          enableConversationDeletion: true,
          theme: "prism",
          themeColor: "#2563eb"
        });
      };
    }
  }, [chatVisible]);

  const chatStyle = {
    display: chatVisible ? 'block' : 'none',
    width: '100wv',
    height: '100hv',
  };

  return  <div></div>;
};

export default Chatbot;