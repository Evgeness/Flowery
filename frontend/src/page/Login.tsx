import { Typography, TextField, Button, Stack, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const navigate = useNavigate(); // Хук для перехода

  return (
    <AuthLayout>
      <Stack spacing={3} sx={{ textAlign: 'center' }}>
        <Typography variant="h5">Вход в аккаунт</Typography>
        <Typography variant="body2" color="text.secondary">
          Введите почту и пароль
        </Typography>
        <TextField label="Почта" type="email" fullWidth variant="outlined" />
        <TextField label="Пароль" type="password" fullWidth variant="outlined" />
        
        {/* Добавили onClick для перехода на главную */}
        <Button 
          variant="contained" 
          fullWidth 
          size="large"
          onClick={() => navigate('/dashboard')}
        >
          Войти
        </Button>
        
        <Typography variant="body2">
          Нет аккаунта?{' '}
          <MuiLink component={Link} to="/register" underline="hover">
            Зарегистрируйтесь
          </MuiLink>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}