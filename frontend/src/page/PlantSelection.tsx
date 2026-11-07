// src/page/PlantSelection.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Card, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fade, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../shared/api/axios'; 

interface Plant {
  image_url: string | null;
  id: number;
  name: string;
  description: string;
}

export default function PlantSelection() {
  const navigate = useNavigate();
  
  const [catalog, setCatalog] = useState<Plant[]>([]); 
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isAdding, setIsAdding] = useState(false); 

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await api.get('/plants'); 
        setCatalog(response.data);
      } catch (error) {
        console.error("Ошибка загрузки каталога", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleClose = () => setSelectedPlant(null);

  const handleConfirmAdd = async () => {
    if (!selectedPlant) return;
    
    setIsAdding(true);
    try {
      await api.post('/my-plants', { 
        plant_id: selectedPlant.id, 
        custom_name: selectedPlant.name 
      });
      
      setSelectedPlant(null);
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error("Ошибка добавления", error);
      alert("Не удалось добавить растение. Возможно, оно уже добавлено.");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Выберите растение
        </Typography>
        <Typography color="text.secondary">
          Выберите растение, за которым хотите ухаживать
        </Typography>
      </Box>
      
      {/* ГЛАВНОЕ ИСПРАВЛЕНИЕ ЗДЕСЬ: используем auto-fill и фиксированную ширину 320px */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', // На мобилках 1 колонка на всю ширину
            sm: 'repeat(auto-fill, 320px)' // На больших экранах колонки ровно по 320px
          }, 
          gap: 3, // Расстояние между карточками
          justifyContent: 'start' // Прижимаем сетку к левому краю
        }}
      >
        {catalog.map((plant, index) => (
          <Fade in={true} timeout={500 + index * 200} key={plant.id}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                width: '100%',        
                boxShadow: 2, 
                borderRadius: 3, 
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
              }}
            >
              <Box sx={{ height: 180, bgcolor: '#e8f5e9', borderRadius: 2, mb: 2, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {plant.image_url ? (
                  <img 
                    src={plant.image_url} 
                    alt={plant.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <Typography color="text.secondary">Фото растения</Typography>
                )}
              </Box>
              <Typography variant="h6" sx={{ mb: 2, flexGrow: 1 }}>{plant.name}</Typography>
              <Button variant="contained" fullWidth onClick={() => setSelectedPlant(plant)} sx={{ borderRadius: 2 }}>
                Подробнее
              </Button>
            </Card>
          </Fade>
        ))}
      </Box>

      {/* Модальное окно */}
      <Dialog open={!!selectedPlant} onClose={isAdding ? undefined : handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 600, color: '#000000' }}>
          {selectedPlant?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#000000' }}>
            {selectedPlant?.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} color="inherit" disabled={isAdding}>
            Отмена
          </Button>
          <Button 
            onClick={handleConfirmAdd} 
            variant="contained" 
            color="primary"
            disabled={isAdding} 
          >
            {isAdding ? 'Добавление...' : 'Добавить растение'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}