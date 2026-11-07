// src/page/Register.tsx
import { useState } from 'react';
import { Typography, TextField, Button, Stack, Link as MuiLink, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../shared/ui/AuthLayout'; // Проверьте правильность пути к AuthLayout
import api from '../shared/api/axios'; // Убедитесь, что axios.ts создан

export default function Register() {
  const navigate = useNavigate();

  // Состояния для полей формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик изменения полей
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Сбрасываем ошибку при вводе
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Простая валидация
    if (!formData.name || !formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      // Отправка запроса на бэкенд
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Если регистрация успешна, перекидываем на страницу входа
      navigate('/login');
    } catch (err: any) {
      // Обработка ошибок от сервера (например, email уже занят)
      setError(err.response?.data?.detail || 'Ошибка при регистрации. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Оборачиваем всё в форму для отправки по Enter */}
      <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
          Создать аккаунт
        </Typography>

        {/* Блок для вывода ошибок */}
        {error && <Alert severity="error">{error}</Alert>}

        <TextField 
          label="Имя" 
          name="name" 
          fullWidth 
          variant="outlined" 
          value={formData.name}
          onChange={handleChange}
        />
        <TextField 
          label="Почта" 
          name="email" 
          type="email" 
          fullWidth 
          variant="outlined" 
          value={formData.email}
          onChange={handleChange}
        />
        <TextField 
          label="Пароль" 
          name="password" 
          type="password" 
          fullWidth 
          variant="outlined" 
          value={formData.password}
          onChange={handleChange}
        />
        <TextField 
          label="Повторите пароль" 
          name="confirmPassword" 
          type="password" 
          fullWidth 
          variant="outlined" 
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          size="large" 
          disabled={isLoading}
          sx={{ mt: 1 }}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>

        {/* ВОТ ОНА: Ссылка на страницу входа */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Уже есть аккаунт?{' '}
          <MuiLink component={Link} to="/login" underline="hover" sx={{ fontWeight: 'bold', color: '#689f38' }}>
            Войти
          </MuiLink>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}