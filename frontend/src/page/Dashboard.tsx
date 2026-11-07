// src/page/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Alert, Fade, CircularProgress } from '@mui/material';
import { LocalFlorist, Spa } from '@mui/icons-material'; 
import { Link, useNavigate } from 'react-router-dom';
import api from '../shared/api/axios';

interface UserPlant {
  id: number;
  custom_name: string | null;
  last_watered_at: string;
  next_watering_at: string;
  plant: {
    id: number;
    name: string;
    description: string;
    watering_interval_days: number;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const response = await api.get('/my-plants');
        setPlants(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Ошибка загрузки:", err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Не удалось загрузить ваши растения. Попробуйте позже.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [navigate]);

  const handleWater = async (userPlantId: number) => {
    try {
      await api.post(`/my-plants/${userPlantId}/water`);
      const response = await api.get('/my-plants');
      setPlants(response.data);
    } catch (err) {
      alert("Не удалось полить растение");
    }
  };

  // 1. СОСТОЯНИЕ ЗАГРУЗКИ (Крутящийся индикатор)
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} sx={{ color: '#56ab2f' }} />
      </Box>
    );
  }

  // 2. СОСТОЯНИЕ ОШИБКИ
  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  // 3. СОСТОЯНИЕ ПУСТОТЫ
  if (plants.length === 0) {
    return (
      <Fade in={true} timeout={800}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
            Выберите свое первое растение
          </Typography>
          <Button
            variant="contained"
            startIcon={<LocalFlorist />} 
            onClick={() => navigate('/select-plant')}
            sx={{ 
              mt: 2, borderRadius: 50, px: 4, py: 1.5, 
              background: 'linear-gradient(45deg, #69ee51 30%, #44ac2af1 90%)',
              color: '#fff', fontWeight: 'bold', boxShadow: '0px 4px 15px rgba(255, 154, 158, 0.4)', 
              '&:hover': { background: 'linear-gradient(45deg, #45e52c 30%, #1be96d 90%)' }
            }}
          >
            Добавьте растение
          </Button>
        </Box>
      </Fade>
    );
  }

  // 4. СОСТОЯНИЕ УСПЕХА (Карточки с анимацией)
  return (
    <Box>
      <Fade in={true} timeout={500}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
          Мои растения
        </Typography>
      </Fade>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
        {plants.map((item, index) => (
          <Card 
            key={item.id} 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              opacity: 0, 
              animation: 'slideUp 0.5s ease-out forwards',
              animationDelay: `${index * 0.1}s`, 
              '@keyframes slideUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                {item.custom_name || item.plant.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Следующий полив: {new Date(item.next_watering_at).toLocaleDateString('ru-RU')}
              </Typography>
            </CardContent>
            
            <Box sx={{ display: 'flex', gap: 1, p: 2, pt: 0 }}>
              <Button 
                component={Link} 
                to={`/plant/${item.id}`} 
                variant="contained" 
                startIcon={<Spa />} 
                sx={{ 
                  flexGrow: 1,
                  background: 'linear-gradient(45deg, #56ab2f 0%, #a8e063 100%)',
                  color: '#fff', fontWeight: 'bold',
                  '&:hover': { background: 'linear-gradient(45deg, #4a9628 0%, #96cc57 100%)' }
                }}
              >
                Подробнее
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => handleWater(item.id)}
                title="Отметить как политое"
                sx={{ borderColor: '#56ab2f', color: '#56ab2f' }}
              >
                💧
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}