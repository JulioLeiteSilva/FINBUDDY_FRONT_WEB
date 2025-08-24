// src/routes/AuthRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import { LoginPageView, RegisterPageView } from '../pages/Auth';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPageView />} />
      <Route path="/register" element={<RegisterPageView />} />
      <Route path="*" element={<LoginPageView />} />
    </Routes>
  );
};

export default AuthRoutes;
