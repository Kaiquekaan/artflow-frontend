import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

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

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
    (response) => {
        return response;  // Retorna a resposta normalmente
    },
    (error) => {
        // Verifica se o erro é por falha de autenticação (401)
        if (error.response && error.response.status === 401) {
            // Aqui você pode redirecionar o usuário para a página de login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);



export default api