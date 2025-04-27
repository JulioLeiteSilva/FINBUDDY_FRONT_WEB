// src/styles/theme.ts
import { createTheme } from '@mui/material/styles';

const commonTheme = {
  typography: {
    fontFamily: '"Outfit", sans-serif', // Aplica Outfit globalmente
    h1: {
      fontFamily: '"Outfit", serif',
    },
    h2: {
      fontFamily: '"Outfit", serif',
    },
    h3: {
      fontFamily: '"Outfit", serif'
    },
    h4: {
      fontFamily: '"Outfit", serif'
    },
    h5: {
      fontFamily: '"Outfit", serif'
    },
    h6: {
      fontFamily: '"Outfit", serif'
    },
  },
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#311D30',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  ...commonTheme
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C99F50',
    },
    secondary: {
      main: '#E9EBAB',
    },
  },
  ...commonTheme
});
