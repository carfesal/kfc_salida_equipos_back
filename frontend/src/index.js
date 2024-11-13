// src/index.js
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import InsertUbicacion from './dashboard/insert/salidaEq';
// Carga perezosa del componente
const Creasalida = React.lazy(() => import('./Dashboard2'));
//const Dashboard2 = React.lazy(() => import('./Dashboard2'));
const Consultasalida = React.lazy(() => import('./dashboard/select/SelectEquipos2'));

const AppRoutes = () => {
  return (
    <Routes>16
      {/* Ruta principal */}
      <Route path="/consultasalida" element={<Consultasalida />} />
      <Route path="/creasalida" element={<Creasalida />} />

      {/* Ruta por Defecto para Rutas No Encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <AppRoutes />
      </Suspense>
  </Router>
);
