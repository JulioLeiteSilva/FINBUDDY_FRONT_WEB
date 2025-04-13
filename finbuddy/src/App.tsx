import React, { useEffect } from 'react'
import { ThemeProvider, CssBaseline} from '@mui/material';
import { lightTheme, darkTheme } from './styles/theme';
import './App.css'
import { useThemeStore } from './store/themeStore';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { listenAuthState } from './store/authStore';

function App() {
  const { theme } = useThemeStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    listenAuthState();
  }, []);


  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
