import React, { useEffect, useState, useContext, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEllipsisVertical, faArrowDown, faTrashCan, faPencil} from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane as regularPlane, faCopy as regularCopy, faEyeSlash as regularSlash } from '@fortawesome/free-regular-svg-icons';
import { UserContext } from '../../Context/UserContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import api from '../../api';



function ChatWindow({ friend }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [hoveredMessage, setHoveredMessage] = useState(null); // Para identificar a mensagem em foco
    const [showNewMessageIcon, setShowNewMessageIcon] = useState(false); 
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const chatEndRef = useRef(null); // Referência para o fim do chat
    const chatBodyRef = useRef(null);
    const ws = useRef(null); 
    const { data: userData } = useContext(UserContext);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const optionsRef = useRef(null);
    const [editingMessageId, setEditingMessageId] = useState(null); // ID da mensagem em edição
    const [editedContent, setEditedContent] = useState(''); 

    const roomName = friend ? `${Math.min(friend.id, userData?.userdata.user_id)}_${Math.max(friend.id, userData?.userdata.user_id)}` : null;
    const socketUrl = roomName ? `ws://localhost:8000/ws/chat/${roomName}/` : null;

    useEffect(() => {
        if (!socketUrl) return;

        // Feche a conexão existente antes de abrir uma nova
        if (ws.current) {
            ws.current.close();
        }

        // Abra uma nova conexão WebSocket
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
            console.log('WebSocket conectado:', socketUrl);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log('type vindo', data.type)
            console.log('data vindo', data)
        
            if (data.type === "message_edited") {
                const editedMessage = data.message;
        
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === editedMessage.id
                            ? { ...msg, ...editedMessage } // Substitui o conteúdo da mensagem editada
                            : msg
                    )
                );
            } else if (data.type === "new_message") {
                const newMessage = data.message;

                setMessages((prevMessages) => {
                    // Substituir a mensagem temporária comparando o timestamp
                    const closestMessageIndex = prevMessages.findIndex(
                        (msg) =>
                            msg.sender_username === userData?.userdata.username && // Mensagem do remetente
                            Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 1000 // Timestamps próximos
                    );

                    if (chatBodyRef.current) {
                        const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
                        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
                        if (isNearBottom) {
                            scrollToBottom();
                        } else {
                            setHasNewMessage(true);
                        }
                    }
    
                    if (closestMessageIndex !== -1) {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[closestMessageIndex] = newMessage; // Substitui pela mensagem com ID real
                        return updatedMessages;
                    }
    
                    // Adicionar nova mensagem (de outros usuários ou mensagens que não são temporárias)
                    return [...prevMessages, newMessage];
                });
        
               

                console.log('novo array de mensagens: ', messages)
        
                if (chatBodyRef.current) {
                    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
                    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
                    if (isNearBottom) {
                        scrollToBottom();
                    }
                }
            }  else if (data.type === "message_deleted") {
                const deletedMessageId = data.message_id;
        
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== deletedMessageId) // Remove a mensagem pelo ID
                );
            } else {
                console.warn("Tipo de mensagem WebSocket desconhecido:", data.type);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket desconectado.');
        };

        ws.current.onerror = (err) => {
            console.error('Erro no WebSocket:', err);
        };

        return () => {
            // Certifique-se de fechar a conexão ao desmontar ou mudar a sala
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, [socketUrl]);

    useEffect(() => {
        const loadMessageHistory = async () => {
            if (!roomName) return;
            try {
                const response = await api.get(`/api/messages/history/${roomName}/`);
                console.log('Histórico de mensagens:', response.data);
                setMessages(response.data);
            } catch (error) {
                console.error("Erro ao carregar o histórico de mensagens:", error);
            }
        };

        if (friend) {
            loadMessageHistory();
        }
    }, [friend, roomName]);

    useEffect(() => {
        const handleScroll = () => {
            if (!chatBodyRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;

            // Se o usuário está perto do final, esconda o ícone
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
            if (isNearBottom) {
                setShowNewMessageIcon(false);
                setHasNewMessage(false);
            } else {
                setShowNewMessageIcon(true);
            }
        };

        const chatBody = chatBodyRef.current;
        chatBody?.addEventListener('scroll', handleScroll);
        return () => chatBody?.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setTimeout(() => {
                    setIsOptionsVisible(false);
                }, 300); // Adiciona o atraso
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim() && ws.current && ws.current.readyState === WebSocket.OPEN) {
            const tempId = `temp-${Date.now()}`;
            const tempMessage = {
                id: tempId, // ID temporário
                content: message,
                sender_displayname: userData?.userdata.displayname,
                sender_username: userData?.userdata.username,
                profile_picture_url: userData?.userdata.profile_picture_url,
                timestamp: new Date().toISOString(),
                
            };

            setMessages((prevMessages) => [...prevMessages, tempMessage]);

            scrollToBottom();

            // Enviar a mensagem pelo WebSocket
            ws.current.send(JSON.stringify({
                'message': message,
                'sender': userData?.userdata.user_id,
                'room_name': roomName,
            }));
            setMessage('');
        } else {
            console.error('WebSocket não está conectado.');
        }
    };

    const handleHideMessage = async (messageId) => {
        try {
            const response = await api.post(`/api/messages/${messageId}/hide/`);
            if (response.status === 200) {
                setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
            }
        } catch (error) {
            console.error("Erro ao ocultar a mensagem:", error);
        }
    };

    const submitEditedMessage = async () => {
        if (!editedContent.trim()) return; // Impede envio de conteúdo vazio
        try {
            const response = await api.put(`/api/messages/${editingMessageId}/`, {
                content: editedContent,
            });
    
            if (response.status === 200) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === editingMessageId ? { ...msg, content: response.data.content } : msg
                    )
                );
                setEditingMessageId(null); // Sai do modo de edição
                setEditedContent(''); // Reseta o conteúdo editado
            }
        } catch (error) {
            console.error('Erro ao editar a mensagem:', error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const response = await api.delete(`/api/messages/${messageId}/`);
            if (response.status === 204) {
                
                setIsOptionsVisible(false);
            }
        } catch (error) {
            console.error("Erro ao excluir a mensagem:", error);
        }
    };

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            requestAnimationFrame(() => {
                chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
            });
        }
    };

    const formatPostDate = (dateString) => {
        if (!dateString) return '';
        const date = parseISO(dateString);
        const distance = formatDistanceToNow(date, { addSuffix: true, locale: pt });
        return distance.replace('aproximadamente ', '');
    };

    const toggleOptions = () => {
        setIsOptionsVisible((prev) => !prev);
    };

    const handleMouseEnterMessage = (index) => {
        clearTimeout(optionsRef.current?.timeoutId); // Cancela qualquer temporizador
        setHoveredMessage(index); // Atualiza instantaneamente para a nova mensagem
        setIsOptionsVisible(false); // Fecha o menu anterior (se estiver visível)
    };
    
    const handleMouseLeaveMessage = () => {
        // Não faz nada diretamente aqui; o desaparecimento é tratado pelo handleMouseEnterMessage
    };
    
    const handleMouseEnterOptions = () => {
        clearTimeout(optionsRef.current?.timeoutId); // Cancela o desaparecimento
        setIsOptionsVisible(true); // Garante que o menu continue visível
    };
    
    const handleMouseLeaveOptions = () => {
        // Não faz nada; o menu só desaparece ao passar para outra mensagem
    };

    const startEditingMessage = (message) => {
        setEditingMessageId(message.id); // Define a mensagem em edição
        setEditedContent(message.content); // Preenche o campo com o conteúdo atual
    };

    const cancelEditing = () => {
        setEditingMessageId(null); // Sai do modo de edição
        setEditedContent(''); // Reseta o conteúdo editado
    };


    
    return (
        <>
         <div className='chat-header'>
                <div
                className="d-flex align-items-center p-2 link-dark text-decoration-none "
                id="dropdownUser3"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >
                <button className='btn-open-profile' onClick={() => handleProfileClick(data?.username)}>
            <img
            src={!friend ? 'none' : friend.profile_picture_url} //user.usedata.profile_picture_url
            width={45} // tamanho adequado para ser mais visível
            height={45}
            className="img-sidebar-profile rounded-circle me-2 ms-2" // Adiciona margem à direita
            /></button>
        <div className="user-info">
            <p className="user-displayname mb-0">{friend?.displayname ? friend?.displayname  : friend?.username }</p>
            <p className="user-email mb-0">{friend?.user_tag}</p>
        </div>
        </div>
        
         </div>
         <div className='chat-body-container' ref={chatBodyRef} onMouseLeave={() => setHoveredMessage(null)}>
        <div className='chat-content'>
            <div className='chat-body' >
                {messages.map((msg, index) => (
                    <div className='menssage-container' onMouseEnter={() => handleMouseEnterMessage(index)} onMouseLeave={() => setHoveredMessage(null)} 
                     >
                    <img src={msg.profile_picture_url} alt="msg-pic" />
                    <div className='menssage-content'>
                    <strong>{msg.sender_displayname ? msg.sender_displayname : msg.sender_username } <span>{formatPostDate(msg.timestamp)}</span> {msg.last_edited_at && (
            <span className="edited-label"> (editado {formatPostDate(msg.last_edited_at)})</span>
        )}</strong> 
                    {editingMessageId === msg.id ? (
                        <div className='edit-message'>
                             <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder='Digite a nova mensagem'
                                rows={3} // Define o número de linhas visíveis
                                style={{
                                    resize: 'none', // Evita que o usuário redimensione o campo
                                    width: '100%', // Garante que ocupe o espaço necessário
                                }}
                            />
                            <div className='edit-message-btns-container'>
                            <button onClick={submitEditedMessage}>Salvar</button>
                            <button onClick={cancelEditing}>Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <div className='message-body'>
                            <p key={index}>{msg.content}</p>
                        </div>
                    )}
                    </div>
                    {hoveredMessage === index && ( 
                                <div className="options-btn-container" ref={optionsRef}  onMouseEnter={() => setHoveredMessage(index)} // Mantém o botão ativo
                                onMouseLeave={handleMouseLeaveMessage}>
                                <button onClick={toggleOptions}>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </button>
                                {isOptionsVisible && (
                                    <div className="options-content" onMouseEnter={handleMouseEnterOptions} // Cancela o temporizador
                                    onMouseLeave={handleMouseLeaveOptions}// Evita que suma ao passar o mouse
                                    >
                                        {msg.sender_username === userData.username && (
                                            <button onClick={() => startEditingMessage(msg)}><FontAwesomeIcon icon={faPencil} /></button>
                                        )}
                                        <button><FontAwesomeIcon icon={regularCopy} /></button>
                                        <button onClick={() => handleHideMessage(msg.id)}><FontAwesomeIcon icon={regularSlash} /></button>
                                        {msg.sender_username === userData.username && (
                                            <button onClick={() => handleDeleteMessage(msg.id)}><FontAwesomeIcon icon={faTrashCan} /></button>
                                        )}   
                                    </div>
                                )}
                            </div>
                            )}
                    </div>
                ))}
                 <div ref={chatEndRef} />
            </div>
            {showNewMessageIcon && (
                    <div className="new-message-icon" onClick={scrollToBottom}>
                        <FontAwesomeIcon icon={faArrowDown} />
                        {hasNewMessage && (
                        <span className="new-message-badge"></span>
                    )}
                    </div>
                )}
               
        </div>
        <div className='chat-input-conteinar'>
            <input 
                type="text" 
                value={message} 
                placeholder={`Conversar com ${friend?.username}`}
                onChange={e => setMessage(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()} 
            />
            <button onClick={handleSendMessage}><FontAwesomeIcon icon={regularPlane} /></button>
            </div>
            </div>
    </>
    );
}

export default ChatWindow;
