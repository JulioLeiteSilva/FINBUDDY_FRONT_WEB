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
} from '@mui/material';
import backgroundImage from '../../../assets/images/bg-login.png';
import FinbuddyLogoHeader from '../../../components/finbuddyLogoHeader';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const res = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await res.user.getIdToken();
      login(res.user, token);
      navigate('/');
    } catch (err) {
      console.error('Erro ao logar:', err);
      // Aqui você pode adicionar lógica para exibir mensagens de erro ao usuário
    }
  };
  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          zIndex: 0,
        }}
      />
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
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                size="medium"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />

              <TextField
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                size="medium"
                {...register('password')}
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
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit(onSubmit)}
              >
                Entrar
              </Button>
            </Stack>
            <Typography mt={3} mb={20} fontSize="0.875rem">
              Novo por aqui?{' '}
              <Link href="/register" underline="hover">
                Crie sua conta gratuitamente.
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
