// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './page/Welcome';
import Login from './page/Login';
import Register from './page/Register';
import Dashboard from './page/Dashboard';
import PlantSelection from './page/PlantSelection';
import PlantDetails from './page/PlantDetails';
import Layout from './components/Layout'; // Импортируем макет

function App() {
  return (
    <Router>
      <Routes>
        {/* Страницы без шторки (до авторизации) */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Страницы со шторкой (внутри Layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/select-plant" element={<PlantSelection />} />
          <Route path="/plant/:id" element={<PlantDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;