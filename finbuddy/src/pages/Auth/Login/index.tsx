import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../services/firebase';
import { useAuthStore } from '../../../store/authStore';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      login(res.user, token);
      navigate('/');
    } catch (err) {
      console.error('Erro ao logar:', err);
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
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                size="medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
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
