import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleXmark, faBell } from '@fortawesome/free-solid-svg-icons';

const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient(); // React Query Client

  // Fetch notifications
  const { data: notifications, error, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/api/notifications/'),
    staleTime: 60000, // 1 minuto
    cacheTime: 300000, // Manter no cache por 5 minutos
    retry: false,
  });

  queryClient.setQueryData(['notifications'], (oldData) => {
    if (!oldData) {
      return oldData; // Se oldData for undefined, retorna ele sem mudanças
    }
  
    return {
      ...oldData,
      data: oldData.data?.map(notification => ({
        ...notification,
        is_read: true // Marcar todas como lidas no estado local
      })) || []
    };
  });

useEffect(() => {
  queryClient.prefetchQuery({
      queryKey: ['notifications'],
      queryFn: () => api.get('/api/notifications/')
  });
}, [queryClient]);

  const markNotificationsAsRead = async () => {
    if (!unreadNotifications) return; // Evitar marcar como lidas se todas já estão lidas
    try {
       await api.post('/api/notifications/mark-all-as-read/');
       queryClient.invalidateQueries(['notifications']);
    } catch (err) {
        console.error("Erro ao marcar notificações como lidas:", err);
    }
};

const handleShowNotifications = () => {
  setShowNotifications(prevState => !prevState);
  if (!showNotifications && unreadNotifications) {
    markNotificationsAsRead(); 
  }
};
  // Aceitar solicitação de amizade
  const handleAcceptFriendRequest = async (notification_id) => {
    try {
      await api.post(`/api/accept-friend-request/${notification_id}/`);
      // Remover a notificação do estado local
      queryClient.setQueryData(['notifications'], (oldData) => ({
        ...oldData,
        data: oldData.data.filter((notification) => notification.id !== notification_id),
      }));
    } catch (error) {
      console.error('Erro ao aceitar solicitação de amizade:', error);
    }
  };

  // Recusar solicitação de amizade
  const handleRejectFriendRequest = async (notification_id) => {
    try {
      await api.post(`/api/remove-or-reject-friend/${notification_id}/`);
      // Remover a notificação do estado local
      queryClient.setQueryData(['notifications'], (oldData) => ({
        ...oldData,
        data: oldData.data.filter((notification) => notification.id !== notification_id),
      }));
    } catch (error) {
      console.error('Erro ao recusar solicitação de amizade:', error);
    }
  };

  // Deletar notificação
  const handleDeleteNotification = async (notification_id) => {
    try {
      await api.post(`/api/delete-notification/${notification_id}/`);
      // Remover a notificação do estado local
      queryClient.setQueryData(['notifications'], (oldData) => ({
        ...oldData,
        data: oldData.data.filter((notification) => notification.id !== notification_id),
      }));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Verificar se há notificações não lidas
  const unreadNotifications = notifications.data.some((notification) => !notification.is_read);

  return (
    <div>
      <button className='btn-navbar' onClick={handleShowNotifications}>
        <FontAwesomeIcon icon={faBell} />
        {unreadNotifications && (
          <div className='bell-indication'>
            {notifications.data.length}
          </div>
        )}
      </button>
      {showNotifications && (
        <div className='notifications-dropdown'>
          <div className='notifications-title-div'>
            <p>Notificações</p>
            <button onClick={handleShowNotifications}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          </div>
          {notifications.data.length > 0 ? (
            <div className='notification-content'>
              <ul>
                {notifications.data.map((notification) => (
                  <li key={notification.id}>
                    <div className={`notification-item ${notification.type === 'friend_request' ? 'friend_request' : ''}`}>
                      <div className='notification-container'>
                        <div className='notification-container-content'>
                          <p>{notification.content}</p>
                        </div>
                        <div className='notification-footer'>
                          <small>{new Date(notification.created_at).toLocaleString()}</small>
                          {notification.type === 'friend_request' && (
                            <div className='friend-request-buttons'>
                              <button
                                className='btn-blue notifications'
                                onClick={() => handleAcceptFriendRequest(notification.id)}
                              >
                                Aceitar
                              </button>
                              <button
                                className='btn-white notifications'
                                onClick={() => handleRejectFriendRequest(notification.id)}
                              >
                                Recusar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='notification-side-btns'>
                          {notification.type === 'friend_accepted' && (
                            <button
                              className='btn-white notifications-accepted'
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          )}
                        </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='notification-content'>
              <p className='p-none-notification'>Nenhuma notificação.</p>
            </div>
          )}
          <div className='notifications-dropdown-footer'>
            <button>Limpar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
