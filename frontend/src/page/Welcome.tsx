import { Typography, Button, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function Welcome() {
  return (
    <AuthLayout>
      {/* ИСПРАВЛЕНО: убрали textAlign и alignItems, добавили их в sx */}
      <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h4">Добро пожаловать</Typography>
        <Typography variant="body2" color="text.secondary">
          Flowery помогает отслеживать растения. Уведомления о поливе приходят в Telegram-боте.
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button component={Link} to="/login" variant="contained" fullWidth>
            Войти
          </Button>
          <Button component={Link} to="/register" variant="outlined" fullWidth>
            Зарегистрироваться
          </Button>
        </Box>
      </Stack>
    </AuthLayout>
  );
}