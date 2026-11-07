import axios, { type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// 1. ПЕРЕХВАТЧИК ЗАПРОСОВ (Подставляет Access-токен)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. ПЕРЕХВАТЧИК ОТВЕТОВ (Ловит ошибку 401 и обновляет токен)
api.interceptors.response.use(
  (response) => response, // Если всё ок, просто возвращаем ответ
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 (Unauthorized) и мы еще не пытались обновить токен для этого запроса
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // Делаем запрос на обновление токена
        const response = await axios.post('http://localhost:8000/api/auth/refresh', {
          refresh_token: refreshToken,
        });

        // Сохраняем новые токены
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);

        // Повторяем исходный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Если Refresh-токен тоже протух или некорректен (Задание 3)
        // Очищаем хранилище и кидаем на страницу входа
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;