// src/routes/AppRouter.tsx
import { useAuthStore } from '../store/authStore';
import AuthRoutes from './AuthRoutes';
import PrivateRoutes from './PrivateRoutes';

const AppRouter = () => {
  const { user } = useAuthStore();

  // Se houver usuário autenticado, carrega as rotas privadas
  // Senão, carrega as rotas públicas (auth)
  return user ? <PrivateRoutes /> : <AuthRoutes />;
};

export default AppRouter;
