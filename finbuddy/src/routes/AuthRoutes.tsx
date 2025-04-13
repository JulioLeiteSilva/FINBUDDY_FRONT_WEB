// src/routes/AuthRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

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
