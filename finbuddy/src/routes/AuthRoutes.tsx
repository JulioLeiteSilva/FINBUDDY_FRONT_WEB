// src/routes/AuthRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import { Login, Register } from '../pages/Auth';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AuthRoutes;
