import { SxProps, Theme } from '@mui/material/styles';
import backgroundImage from '../../assets/images/bg-login.png';

export const authPageContainerSx: SxProps<Theme> = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
};

export const authPageBackgroundSx: SxProps<Theme> = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(8px)',
  zIndex: 0,
};

export const authContentContainerSx: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  px: 2,
};

export const authCardContainerSx: SxProps<Theme> = {
  mt: 10,
};

export const authCardPaperSx: SxProps<Theme> = {
  p: 7,
  borderRadius: 4,
};

export const authLogoHeaderBoxSx: SxProps<Theme> = {
  mb: 9,
  display: 'flex',
  justifyContent: 'center',
};

export const authLogoHeaderInnerBoxSx: SxProps<Theme> = {
  width: 339,
  height: 99,
};

export const authFormStackSx: SxProps<Theme> = {
  spacing: 3,
};

export const authTextFieldSx: SxProps<Theme> = {
  width: '100%',
};

export const authButtonSx: SxProps<Theme> = {
  marginTop: (theme) => theme.spacing(2),
};

export const authFooterTypographySx: SxProps<Theme> = {
  mt: 3,
  fontSize: '0.875rem',
  textAlign: 'center',
};

export const authFooterLinkSx: SxProps<Theme> = {
  underline: 'hover',
};