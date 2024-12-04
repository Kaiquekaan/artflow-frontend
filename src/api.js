import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL

})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
             config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!refresh) {
      window.location.href = "/login"; // Se não tiver refresh token, redireciona para o login
      return Promise.reject("No refresh token available");
    }
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/token/refresh/`, {
        refresh,
      });
  
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh); // Atualiza o refresh token se necessário
      return response.data.access; // Retorna o novo token de acesso
    } catch (error) {
      localStorage.clear(); // Limpa os tokens e redireciona para login se falhar
      window.location.href = "/login";
      return Promise.reject(error);
    }
  };

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
    (response) => {
        return response;  // Retorna a resposta normalmente
    },
    async (error) => {
        // Verifica se o erro é por falha de autenticação (401)
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken(); // Tenta fazer o refresh do token
        
                // Atualiza o header Authorization com o novo token
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        
                // Refaz a requisição original com o novo token
                return api(originalRequest);
              } catch (err) {
                // Se o refresh falhar, o redirecionamento já é tratado na função refreshToken
                return Promise.reject(err);
              }
        }
        return Promise.reject(error);
    }
);



export default api