import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('access_token');

  // Если токена нет — редирект на логин
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Если токен есть — рендерим дочерние маршруты (Дашборд и т.д.)
  return <Outlet />;
}