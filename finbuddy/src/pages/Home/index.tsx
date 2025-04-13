import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../services/firebase';

const Home: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await auth.signOut();
    logout();
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to FinBuddy{user?.email ? `, ${user.email}` : ''}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Your financial buddy for smarter decisions.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{ mt: 4 }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Home;
