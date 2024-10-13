import api from "../api";

export const fetchUserData = async () => {
  const response = await api.get('/api/user/data/');  // Ajuste o endpoint para o correto
  return response.data;
};
