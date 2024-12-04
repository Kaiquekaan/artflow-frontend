import { useState, useCallback } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

function useAuthenticatedRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!refresh) {
      navigate('/login');
      return false;
    }

    try {
      const response = await api.post('/api/user/token/refresh/', { refresh });
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        return true;
      } else {
        localStorage.clear();
        navigate('/login');
        return false;
      }
    } catch (err) {
      console.error('Erro ao renovar o token:', err);
      localStorage.clear();
      navigate('/login');
      return false;
    }
  }, [navigate]);

  const request = useCallback(async (endpoint, method = 'GET', data = null) => {
    setLoading(true);

    const options = {
      method,
      url: endpoint,
      data,  // Para POST, PUT, etc., você pode passar os dados aqui
    };

    try {
      const response = await api(options); // Usa o `api` com interceptors
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err; // Propaga o erro para o componente chamar, se necessário
    }
  }, []);
}

export default useAuthenticatedRequest;
