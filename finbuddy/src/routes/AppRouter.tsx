// src/routes/AppRouter.tsx
import { useAuthStore } from '../store/authStore';
import AuthRoutes from './AuthRoutes';
import PrivateRoutes from './PrivateRoutes';
import { GlobalSnackbar } from '../components/'; // Certifique-se de ajustar o caminho conforme necessário

const AppRouter = () => {
  const { user } = useAuthStore();

  return (
    <>
      <GlobalSnackbar />
      {user ? <PrivateRoutes /> : <AuthRoutes />}
    </>
  );
};

export default AppRouter;
