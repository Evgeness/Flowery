// src/page/PlantSelection.tsx
import { useState } from 'react';
import { Box, Typography, Card, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Plant {
  id: number;
  name: string;
  description: string;
}

export default function PlantSelection() {
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const catalog: Plant[] = [
    { id: 1, name: 'Монстера', description: 'Крупное тропическое растение с характерными резными листьями. Любит яркий рассеянный свет, высокую влажность и регулярный полив.' },
    { id: 2, name: 'Фикус', description: 'Неприхотливое растение с плотными зелеными листьями. Отлично очищает воздух в помещении и не требует частого полива.' },
    { id: 3, name: 'Сансевиерия', description: 'Известна как "тещин язык". Очень выносливое растение, переносит тень и редкий полив. Идеально для новичков.' },
  ];

  const handleClose = () => setSelectedPlant(null);
  const handleConfirmAdd = () => {
    setSelectedPlant(null);
    navigate('/dashboard');
  };

  return (
    // Убрали bgcolor и minHeight, так как они заданы в Layout
    <Box>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
          Выберите растение
        </Typography>
        <Typography color="text.secondary">
          Выберите растение, за которым хотите ухаживать
        </Typography>
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2, sm: 3 } }}>
        {catalog.map((plant) => (
          <Card key={plant.id} sx={{ textAlign: 'center', p: 2, display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 2, borderRadius: 3 }}>
            <Box sx={{ height: 150, bgcolor: '#e8f5e9', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Фото растения</Typography>
            </Box>
            <Typography variant="h6" sx={{ mb: 2, flexGrow: 1 }}>{plant.name}</Typography>
            <Button variant="contained" fullWidth onClick={() => setSelectedPlant(plant)} sx={{ borderRadius: 2 }}>
              Подробнее
            </Button>
          </Card>
        ))}
      </Box>

      {/* Модальное окно */}
      <Dialog open={!!selectedPlant} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 600, color: '#000000' }}>
          {selectedPlant?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#000000' }}>
            {selectedPlant?.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} color="inherit">Отмена</Button>
          <Button onClick={handleConfirmAdd} variant="contained" color="primary">Добавить растение</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}