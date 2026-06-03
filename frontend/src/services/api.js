import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Envia o token JWT automaticamente em TODOS os pedidos
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;