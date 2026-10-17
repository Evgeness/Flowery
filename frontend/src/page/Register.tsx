import { Typography, TextField, Button, Stack, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  return (
    <AuthLayout>
      <Stack spacing={2} textAlign="center">
        <Typography variant="h5">Создать аккаунт</Typography>
        <TextField label="Имя" fullWidth variant="outlined" />
        <TextField label="Почта" type="email" fullWidth variant="outlined" />
        <TextField label="Пароль" type="password" fullWidth variant="outlined" />
        <TextField label="Повторите пароль" type="password" fullWidth variant="outlined" />
        <Button variant="contained" fullWidth size="large" sx={{ mt: 1 }}>
          Зарегистрироваться
        </Button>
        <Typography variant="body2">
          Уже есть аккаунт?{' '}
          <MuiLink component={Link} to="/login" underline="hover">
            Войти
          </MuiLink>
        </Typography>
      </Stack>
    </AuthLayout>
  );
}