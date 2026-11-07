// src/components/Layout.tsx
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography } from '@mui/material';
// Добавили иконку Logout
import { Yard, Add, Logout } from '@mui/icons-material'; 
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'; // Добавили useNavigate

const drawerWidth = 240;

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate(); // Хук для перехода на страницу логина

  const menuItems = [
    { text: 'Мои растения', icon: <Yard />, path: '/dashboard' },
    { text: 'Добавить растение', icon: <Add />, path: '/select-plant' },
  ];

  // Функция выхода (Пункт 5 задания)
  const handleLogout = () => {
    // Очищаем токены на клиенте
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Перекидываем на страницу входа
    navigate('/login');
  };

  // Паттерн для основного фона остается
  const leafPattern = `url("data:image/svg+xml,%3Csvg width='250' height='250' viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cg id='leaf'%3E%3Cpath d='M0,0 C 15,-20 35,-15 45,0 C 35,15 15,20 0,0 Z' fill='none' stroke='%23a5d6a7' stroke-width='1.5'/%3E%3Cpath d='M0,0 L 45,0' fill='none' stroke='%23a5d6a7' stroke-width='1.5'/%3E%3Cpath d='M10,0 Q 15,-10 25,-12' fill='none' stroke='%23a5d6a7' stroke-width='1.5'/%3E%3Cpath d='M10,0 Q 15,10 25,12' fill='none' stroke='%23a5d6a7' stroke-width='1.5'/%3E%3C/g%3E%3C/defs%3E%3Cg opacity='0.35'%3E%3Cuse href='%23leaf' x='40' y='50' transform='rotate(-40 40 50)'/%3E%3Cuse href='%23leaf' x='180' y='70' transform='rotate(25 180 70)'/%3E%3Cuse href='%23leaf' x='70' y='180' transform='rotate(130 70 180)'/%3E%3Cuse href='%23leaf' x='200' y='200' transform='rotate(-90 200 200)'/%3E%3Cuse href='%23leaf' x='125' y='125' transform='rotate(15 125 125) scale(0.7)'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100%',
        backgroundColor: '#f1f8e9', 
        backgroundImage: leafPattern, 
        backgroundRepeat: 'repeat',
        backgroundSize: '350px 350px', 
      }}
    >
      {/* Боковая панель (Шторка) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            bgcolor: '#639A00', 
            color: '#fff',
            // ДОБАВЛЕНО: Делаем панель flex-контейнером, чтобы прижать кнопку выхода к низу
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ p: 2, mb: 2 }}>
          <Typography 
            component="h1" 
            sx={{ color: '#ffffff', fontWeight: 'bold', fontFamily: '"Caveat", cursive', fontSize: { xs: '2rem', md: '2.5rem' } }}
          >
            Flowery
          </Typography>
        </Box>
        
        {/* Основное меню */}
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  sx={{ 
                    borderRadius: 2, 
                    bgcolor: isActive ? '#8bc34a' : '#4e7a00', 
                    '&:hover': { 
                      bgcolor: isActive ? '#7cb342' : '#3e6100',
                    },
                    transition: 'background-color 0.2s ease-in-out'
                  }}
                >
                  <ListItemIcon sx={{ color: '#ffffff', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ '& .MuiListItemText-primary': { color: '#ffffff', fontWeight: isActive ? 700 : 500 } }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* ДОБАВЛЕНО: Кнопка Выхода в самом низу. 
            mt: 'auto' прижимает её к нижнему краю шторки */}
        <List sx={{ px: 1, mt: 'auto', mb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{ 
                borderRadius: 2, 
                '&:hover': { bgcolor: 'rgba(252, 8, 8, 0.93)' } 
              }}
            >
              <ListItemIcon sx={{ color: '#0f0b0b', minWidth: '40px' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText 
                primary="Выйти" 
                sx={{ '& .MuiListItemText-primary': { color: '#0a0202', fontWeight: 600 } }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Основная область контента */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 }, 
          width: `calc(100% - ${drawerWidth}px)`, 
          minHeight: '100vh'
        }}
      >
        <Outlet /> 
      </Box>
    </Box>
  );
}