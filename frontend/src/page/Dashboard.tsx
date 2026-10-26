// src/page/Dashboard.tsx
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { LocalFlorist, Spa } from '@mui/icons-material'; 
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const plants = [{ id: 1, name: 'Монстера' }]; 

  return (
    <Box>
      {plants.length === 0 ? (
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
              background: 'linear-gradient(45deg, #FF9A9E 30%, #FECFEF 90%)',
              color: '#fff', fontWeight: 'bold', boxShadow: '0px 4px 15px rgba(255, 154, 158, 0.4)', 
              '&:hover': { background: 'linear-gradient(45deg, #FF7B80 30%, #FDA8CD 90%)' }
            }}
          >
            Добавьте растение
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
            Мои растения
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {plants.map((plant) => (
              <Card key={plant.id} sx={{ p: 2, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {plant.name}
                  </Typography>
                  
                  <Button 
                    component={Link} to={`/plant/${plant.id}`} variant="contained" startIcon={<Spa />} 
                    sx={{ 
                      mt: 2, background: 'linear-gradient(45deg, #56ab2f 0%, #a8e063 100%)',
                      color: '#fff', fontWeight: 'bold',
                      '&:hover': { background: 'linear-gradient(45deg, #4a9628 0%, #96cc57 100%)' }
                    }}
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}