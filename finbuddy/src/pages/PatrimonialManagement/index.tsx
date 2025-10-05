import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { ModalPatrimonios } from './modal';

export const PatrimonialManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={handleOpen}
        >
          Cadastrar novo patrimômio
        </Button>
      </div>

      <ModalPatrimonios 
        open={isModalOpen}
        onClose={handleClose}
      />
    </Box>
  );
};