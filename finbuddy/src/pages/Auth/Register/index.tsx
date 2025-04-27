import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../../../services/firebase';
import { useAuthStore } from '../../../store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchemaType } from '../../../schemas/auth';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Link,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import FinbuddyLogoHeader from '../../../components/finbuddyLogoHeader';
import { useLoadingStore } from '../../../store/loadingStore';
import { authPageContainerSx, authPageBackgroundSx, authContentContainerSx, authCardContainerSx, authCardPaperSx, authLogoHeaderBoxSx, authLogoHeaderInnerBoxSx, authFormStackSx, authTextFieldSx, authButtonSx, authFooterTypographySx, authFooterLinkSx } from '../authStyles';
import { VisibilityOff, Visibility } from '@mui/icons-material';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { isLoading, startLoading, stopLoading } = useLoadingStore();

  const onSubmit = async (data: RegisterSchemaType) => {
    startLoading();
    try {
      // 1. Cria o usuário no Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = result.user;
      const token = await user.getIdToken();

      // 2. Atualiza a store com auth
      login(user, token);

      // 3. Chama a função `createUser` (Cloud Function)
      const createUserFn = httpsCallable(functions, 'user-preRegisterUser');

      const response = await createUserFn({
        name: data.name, // Use o nome do formulário validado
      });

      console.log('Usuário criado na função:', response.data);

      navigate('/'); // ou redirecionar onde quiser
    } catch (error) {
      console.error('Erro ao registrar:', error);
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
                label="Nome"
                type="text"
                variant="outlined"
                fullWidth
                size="medium"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={authTextFieldSx}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                size="medium"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                helperText={errors.password?.message}
                sx={authTextFieldSx}
              />
              <TextField
                label="Confirme sua Senha"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                size="medium"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
              </Button>
            </Stack>
            <Typography mt={3} mb={5} fontSize="0.875rem" sx={authFooterTypographySx}>
              Já tem uma conta? <Link href="/login" underline="hover" sx={authFooterLinkSx}>Faça login.</Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
