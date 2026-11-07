// src/page/Welcome.tsx
import { Typography, Button, Stack, Box, Paper, Fade } from '@mui/material';
import { Login as LoginIcon, PersonAdd as PersonAddIcon, LocalFlorist } from '@mui/icons-material'; // Добавили иконку цветка
import { Link } from 'react-router-dom';

export default function Welcome() {
  const leafPattern = `url("data:image/svg+xml,%3Csvg width='250' height='250' viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cg id='leaf'%3E%3Cpath d='M0,0 C 15,-20 35,-15 45,0 C 35,15 15,20 0,0 Z' fill='none' stroke='%23a5d6a7' stroke-width='1.5'/%3E%3Cpath d='M0,0 L 45,0' fill='none' stroke='%23a5d6a7' stroke-width='1.5'/%3E%3Cpath d='M10,0 Q 15,-10 25,-12' fill='none' stroke='%23a5d6a7' stroke-width='1.5'/%3E%3Cpath d='M10,0 Q 15,10 25,12' fill='none' stroke='%23a5d6a7' stroke-width='1.5'/%3E%3C/g%3E%3C/defs%3E%3Cg opacity='0.35'%3E%3Cuse href='%23leaf' x='40' y='50' transform='rotate(-40 40 50)'/%3E%3Cuse href='%23leaf' x='180' y='70' transform='rotate(25 180 70)'/%3E%3Cuse href='%23leaf' x='70' y='180' transform='rotate(130 70 180)'/%3E%3Cuse href='%23leaf' x='200' y='200' transform='rotate(-90 200 200)'/%3E%3Cuse href='%23leaf' x='125' y='125' transform='rotate(15 125 125) scale(0.7)'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f8e9',
        backgroundImage: leafPattern,
        backgroundRepeat: 'repeat',
        backgroundSize: '350px 350px',
        p: 2,
      }}
    >
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={6}
          sx={{
            maxWidth: 1000,
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {/* УБРАЛИ БЛОК С КАРТИНКОЙ. Вместо него добавили аккуратную иконку и уменьшили отступы */}
          <Box sx={{ p: { xs: 3, sm: 5 }, pt: 4 }}>
            
            {/* Иконка цветка в кружочке для красоты */}
            <Box 
              sx={{ 
                width: 70, height: 70, borderRadius: '50%', bgcolor: '#e8f5e9', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2 
              }}
            >
              <LocalFlorist sx={{ fontSize: 40, color: '#56ab2f' }} />
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Caveat", cursive',
                fontWeight: 'bold',
                color: '#1b5e20',
                mb: 5,
                lineHeight: 1,
              }}
            >
              Добро пожаловать
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 4, 
                fontSize: '1.30rem', 
                lineHeight: 1.6     
              }}
            >
              Flowery помогает отслеживать растения. Уведомления о поливе приходят в Telegram-боте.
            </Typography>

            <Stack spacing={2}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #56ab2f 0%, #a8e063 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.30rem',
                  boxShadow: '0px 4px 15px rgba(86, 171, 47, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4a9628 0%, #96cc57 100%)',
                  },
                }}
              >
                Войти в аккаунт
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                startIcon={<PersonAddIcon />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#56ab2f',
                  color: '#56ab2f',
                  fontWeight: 'bold',
                  fontSize: '1.30rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#4a9628',
                    backgroundColor: 'rgba(86, 171, 47, 0.05)',
                    borderWidth: 2,
                  },
                }}
              >
                Создать аккаунт
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}