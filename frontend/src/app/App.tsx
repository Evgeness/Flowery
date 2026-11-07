// src/app/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from '../page/Welcome';
import Login from '../page/Login';
import Register from '../page/Register';
import Dashboard from '../page/Dashboard';
import PlantSelection from '../page/PlantSelection';
import PlantDetails from '../page/PlantDetails';
import Layout from '../shared/ui/Layout'; // или откуда вы его импортируете
import ProtectedRoute from './ProtectedRoute'; // <-- Наш новый компонент

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Защищенные маршруты (только для авторизованных) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/select-plant" element={<PlantSelection />} />
            <Route path="/plant/:id" element={<PlantDetails />} />
          </Route>
        </Route>

        {/* Редирект на главную для несуществующих страниц */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;