// src/page/Login.tsx
import { useState } from 'react';
import { Typography, TextField, Button, Stack, Link as MuiLink, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../shared/ui/AuthLayout';
import api from '../shared/api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Отправляем данные на бэкенд
      const response = await api.post('/auth/login', { email, password });
      
      // Сохраняем токены
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      // Перекидываем на дашборд
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Ошибка входа:", err);
      setError(err.response?.data?.detail || 'Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Вход в аккаунт</Typography>
        <Typography variant="body2" color="text.secondary">Введите почту и пароль</Typography>
        
        {error && <Alert severity="error">{error}</Alert>}

        <TextField 
          label="Почта" 
          type="email" 
          fullWidth 
          variant="outlined" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <TextField 
          label="Пароль" 
          type="password" 
          fullWidth 
          variant="outlined" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <Button type="submit" variant="contained" fullWidth size="large" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
        
        <Typography variant="body2">
          Нет аккаунта?{' '}
          <MuiLink component={Link} to="/register" underline="hover" sx={{ fontWeight: 'bold', color: '#689f38' }}>
            Зарегистрируйтесь
          </MuiLink>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}