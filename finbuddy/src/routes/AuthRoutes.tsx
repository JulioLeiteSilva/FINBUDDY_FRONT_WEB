// src/routes/AuthRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import { LoginPage, RegisterPage } from '../pages/Auth';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

export default AuthRoutes;
