import React, { useState } from 'react';
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
  InputAdornment,
  IconButton,
} from '@mui/material';
import backgroundImage from '../../../assets/images/bg-login.png';
import FinbuddyLogoHeader from '../../../components/finbuddyLogoHeader';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

  const onSubmit = async (data: RegisterSchemaType) => {
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
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Fundo com imagem e blur */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`, // substitua pelo caminho da sua imagem
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          zIndex: 0,
        }}
      />

      {/* Camada com o conteúdo */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          px: 2,
        }}
      >
        <Container maxWidth="sm" sx={{ mt: 10 }}>
          <Paper
            elevation={6}
            sx={{
              p: 7,
              borderRadius: 4,
            }}
          >
            <Box mb={9} display="flex" justifyContent="center">
              <Box width={339} height={99}>
                <FinbuddyLogoHeader />
              </Box>
            </Box>

            <Stack spacing={3}>
              <TextField
                label="Nome"
                type="text"
                variant="outlined"
                fullWidth
                size="medium"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
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
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit(onSubmit)}
              >
                Criar Conta
              </Button>
            </Stack>
            <Typography mt={3} mb={5} fontSize="0.875rem">
              Já tem uma conta?{' '}
              <Link href="/login" underline="hover">
                Faça login.
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
