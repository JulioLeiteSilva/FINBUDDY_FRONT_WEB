
import { Button, Box } from '@mui/material';
import { ImpactSimulationPage } from './ImpactSimulationPage';


export const SimulationPage = () => {

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <ImpactSimulationPage />
      </div>
    </Box>
  );
};