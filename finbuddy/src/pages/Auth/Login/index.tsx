import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../services/firebase';
import { useAuthStore } from '../../../store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchemaType } from '../../../schemas/auth';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import backgroundImage from '../../../assets/images/bg-login.png';
import FinbuddyLogoHeader from '../../../components/finbuddyLogoHeader';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoadingStore } from '../../../store/loadingStore';
import { authButtonSx, authCardContainerSx, authCardPaperSx, authContentContainerSx, authFooterLinkSx, authFooterTypographySx, authFormStackSx, authLogoHeaderBoxSx, authLogoHeaderInnerBoxSx, authPageBackgroundSx, authPageContainerSx, authTextFieldSx } from '../authStyles';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { isLoading, startLoading, stopLoading } = useLoadingStore();

  const onSubmit = async (data: LoginSchemaType) => {
    startLoading();
    try {
      const res = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await res.user.getIdToken();
      login(res.user, token);
      navigate('/');
    } catch (err) {
      console.error('Erro ao logar:', err);
      // Aqui você pode adicionar lógica para exibir mensagens de erro ao usuário
    } finally {
      stopLoading(); // Finaliza o loading, independentemente do resultado
    }
  };
  return (
    <Box sx={authPageContainerSx}>
      <Box sx={authPageBackgroundSx} />
      <Box sx={authContentContainerSx}>
        <Container maxWidth="sm" sx={authCardContainerSx}>
          <Paper elevation={6} sx={authCardPaperSx}>
            <Box mb={9} display="flex" justifyContent="center" sx={authLogoHeaderBoxSx}>
              <Box width={339} height={99} sx={authLogoHeaderInnerBoxSx}>
                <FinbuddyLogoHeader />
              </Box>
            </Box>

            <Stack spacing={3} sx={authFormStackSx}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                size="medium"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                sx={authTextFieldSx}
              />
              <TextField
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                size="medium"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                sx={authTextFieldSx}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                sx={authButtonSx}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>
            </Stack>
            <Typography mt={3} mb={20} fontSize="0.875rem" sx={authFooterTypographySx}>
              Novo por aqui? <Link href="/register" underline="hover" sx={authFooterLinkSx}>Crie sua conta gratuitamente.</Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
