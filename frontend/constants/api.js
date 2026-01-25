import axios from "axios";
import { TokenManager } from "../utils/tokenManager";

const api = axios.create({
  baseURL: "http://192.168.100.177:8080/api", // Thay bằng IP máy tính của bạn
  timeout: 10000,
});

// Request interceptor để thêm JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý token hết hạn
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, xóa token và redirect về login
      await TokenManager.removeToken();
      // Có thể emit event để redirect về login
    }
    return Promise.reject(error);
  }
);

export default api;
