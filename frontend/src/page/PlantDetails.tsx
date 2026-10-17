import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function PlantDetails() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Назад
      </Button>
      
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ height: 250, bgcolor: '#e8f5e9', borderRadius: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Здесь будет картинка растения</Typography>
        </Box>
        
        <Typography variant="h4" gutterBottom>Название растения</Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Краткое описание растения, его особенности и предпочтения.
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Как ухаживать:</Typography>
        <Stack spacing={1}>
          <Typography>💧 Полив: Раз в неделю</Typography>
          <Typography>☀️ Свет: Яркий рассеянный</Typography>
          <Typography>🌡️ Температура: +18...+25°C</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}