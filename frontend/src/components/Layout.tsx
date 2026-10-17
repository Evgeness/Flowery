// src/components/Layout.tsx
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Yard, Add } from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function Layout() {
  const location = useLocation();

  const menuItems = [
    { text: 'Мои растения', icon: <Yard />, path: '/dashboard' },
    { text: 'Добавить растение', icon: <Add />, path: '/select-plant' },
  ];

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
      {/* Боковая панель (Шторка) без лоз */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            bgcolor: '#639A00', // Однотонный зеленый фон
            color: '#fff',
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