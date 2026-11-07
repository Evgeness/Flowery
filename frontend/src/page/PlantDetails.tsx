// src/page/PlantDetails.tsx
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material'; // <-- Добавили иконку удаления
import { useNavigate, useParams } from 'react-router-dom';
import api from '../shared/api/axios'; // Проверьте путь

interface UserPlantDetails {
  id: number;
  custom_name: string | null;
  plant: {
    id: number;
    name: string;
    description: string;
    watering_interval_days: number;
    image_url: string | null;
  };
}

export default function PlantDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [plant, setPlant] = useState<UserPlantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для окна подтверждения удаления
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await api.get('/my-plants');
        const found = response.data.find((p: UserPlantDetails) => p.id === Number(id));
        
        if (found) {
          setPlant(found);
        } else {
          setError('Растение не найдено');
        }
      } catch (err) {
        setError('Не удалось загрузить данные о растении');
      } finally {
        setLoading(false);
      }
    };
    fetchPlantDetails();
  }, [id]);

  // Функция удаления растения
  const handleDelete = async () => {
    try {
      await api.delete(`/my-plants/${id}`); // Отправляем DELETE запрос
      navigate('/dashboard'); // Возвращаемся на главную
    } catch (err) {
      alert('Ошибка при удалении. Попробуйте позже.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !plant) {
    return <Alert severity="error" sx={{ m: 4 }}>{error || 'Ошибка'}</Alert>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, margin: '0 auto' }}>
      
      {/* Кнопка Назад */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)} 
        variant="contained" 
        sx={{ 
          mb: 3, bgcolor: '#40b140e3', color: '#ffffff', fontWeight: 'bold',
          borderRadius: 2, boxShadow: 2, 
          '&:hover': { bgcolor: '#85d627', boxShadow: 4 }
        }}
      >
        Назад
      </Button>
      
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        
        {/* Блок с картинкой */}
        <Box sx={{ height: 250, bgcolor: '#e8f5e9', borderRadius: 2, mb: 3, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {plant.plant.image_url ? (
            <img 
              src={plant.plant.image_url} 
              alt={plant.plant.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <Typography color="text.secondary">Здесь будет картинка растения</Typography>
          )}
        </Box>
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {plant.custom_name || plant.plant.name}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {plant.plant.description}
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>Как ухаживать:</Typography>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography>💧 Полив: Раз в {plant.plant.watering_interval_days} дней</Typography>
          <Typography>☀️ Свет: Яркий рассеянный</Typography>
          <Typography>🌡️ Температура: +18...+25°C</Typography>
        </Stack>

        {/* НОВЫЙ БЛОК: Кнопка удаления */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eee', pt: 3 }}>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Delete />}
            onClick={() => setOpenDeleteDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Удалить растение
          </Button>
        </Box>

      </Paper>

      {/* Модальное окно подтверждения удаления */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Удалить растение?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить «{plant.custom_name || plant.plant.name}» из своего списка? Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Отмена
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}