import { useState } from 'react';
import { Button, Box, Stack, Typography, Card, CardContent, Paper } from '@mui/material';
import { ModalPatrimonios } from './modal';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export const PatrimonialManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Nome' },
    { field: 'category', headerName: 'Categoria' },
    { field: 'value', headerName: 'Valor atual' },
  ];

  const rows = [
    { id: 1, name: 'Corrola 2017', category: 'Ativo', value: 90000 },
    { id: 2, name: 'Snow', category: 'Jon', value: 35 },
    { id: 3, name: 'Snow', category: 'Jon', value: 35 },
    { id: 4, name: 'Snow', category: 'Jon', value: 35 },
    { id: 5, name: 'Snow', category: 'Jon', value: 35 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* <Box style={{ textAlign: 'center', marginTop: '50px' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={handleOpen}
        >
          Cadastrar novo patrimômio
        </Button>
      </Box> */}
      <Stack sx={{ alignItems: 'center', }} gap={5}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Stack sx={{ alignItems: 'center' }}>
            <Typography variant='h4'>Patrimônio Total:</Typography>
            <Typography variant='h2'>R$ 10.00,00</Typography>
          </Stack>
        </Box>
        <Box sx={{ bgcolor: 'yellow', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Paper sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    sx={{ border: 0 }}
                  />
                </Paper>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handleOpen}
                >
                  Cadastrar novo patrimômio
                </Button>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ bgcolor: 'cyan', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='h2'>
              Grafico
            </Typography>
          </Box>
        </Box>
      </Stack>

      <ModalPatrimonios
        open={isModalOpen}
        onClose={handleClose}
      />
    </Box>
  );
};