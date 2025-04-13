// src/styles/theme.ts
import { createTheme } from '@mui/material/styles';

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
});
