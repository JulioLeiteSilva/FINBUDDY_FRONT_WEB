// src/routes/PrivateRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import { Box } from '@mui/material';
import SideBar from '../components/sideBar';
import Content from '../components/content';

const PrivateRoutes = () => {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <SideBar />
      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>
    </Box>
  );
};

export default PrivateRoutes;
