/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Button, Box, Stack, Typography, Card, CardContent, Paper } from '@mui/material';
import { ModalPatrimonios } from './modal';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { usePatrimonialManagementStore } from '../../store/patrimonialManagementStore';
import { AnyPatrimonialItemType } from '../../schemas/PatrimonialManagement/PatrimonialItem';
import { mapPatrimonialCategoryToPortuguese } from '../../enums/patrimonialManagement';
import { formatToBrazilianReals } from '../../utils/format';

interface FormattedPatrimonialItem {
  id: string;
  name: string;
  formattedCategory: string;
}

export const PatrimonialManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formatedData, setFormatedData] = useState<FormattedPatrimonialItem[]>([]);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const { fetchPatrimonialItens, patrimonialItens, totalPatrimonyValue } = usePatrimonialManagementStore()

  useEffect(() => {
    fetchPatrimonialItens();
  }, []);

  useEffect(() => {
    if (!patrimonialItens || !Array.isArray(patrimonialItens)) {
      setFormatedData([]);
      return;
    }

    const newFormatedData = patrimonialItens.map((item: AnyPatrimonialItemType) => ({
      id: item.id || crypto.randomUUID(),
      name: item.name,
      formattedCategory: mapPatrimonialCategoryToPortuguese(item.category),
    }));

    setFormatedData(newFormatedData);
  }, [patrimonialItens])

  const columns: GridColDef<FormattedPatrimonialItem>[] = [
    { field: 'name', headerName: 'Nome', flex: 2, renderCell: (params) => <Typography sx={{ textTransform: 'capitalize' }}>{params.value}</Typography> },
    { field: 'formattedCategory', headerName: 'Categoria', flex: 1, renderCell: (params) => <Typography sx={{ textTransform: 'capitalize' }}>{params.value}</Typography> },
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
            <Typography variant='h2'>{formatToBrazilianReals(totalPatrimonyValue)}</Typography>
          </Stack>
        </Box>
        <Box sx={{ bgcolor: 'yellow', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                {patrimonialItens &&
                  <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={formatedData}
                      columns={columns}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      sx={{ border: 0 }}
                      localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                    />
                  </Paper>}

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
          {/* <Box sx={{ bgcolor: 'cyan', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='h2'>
              Grafico
            </Typography>
          </Box> */}
        </Box>
      </Stack>

      <ModalPatrimonios
        open={isModalOpen}
        onClose={handleClose}
      />
    </Box>
  );
};