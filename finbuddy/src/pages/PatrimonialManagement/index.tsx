/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Button, Box, Stack, Typography, Card, CardContent } from '@mui/material';
import { ModalPatrimonios } from './modal';
import { usePatrimonialManagementStore } from '../../store/patrimonialManagementStore';
import { formatToBrazilianReals } from '../../utils/format';
import { PatrimonialItemList } from './components/PatrimonialItemList/PatrimonialItemList';
import { AnyPatrimonialItemType, LiabilityItemType } from '../../schemas/PatrimonialManagement/PatrimonialItem';
import { PatrimonialItemDetailsModal } from './components/PatrimonialItemDetailsModal/PatrimonialItemDetailsModal';
import { UpdatePatrimonialItem } from '../../services/PatrimonialManagement/updatePatrimonialItem';

export const PatrimonialManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AnyPatrimonialItemType | null>(null);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const handleOpenDetails = (item: AnyPatrimonialItemType) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const handlePayInstallment = (liability: LiabilityItemType) => {
    const { history, onCreate, ...rest } = liability;

    UpdatePatrimonialItem({
      ...rest,
      term: liability.term - 1
    });

    handleCloseDetails();
  };

  const { fetchPatrimonialItens, patrimonialItens, totalPatrimonyValue } = usePatrimonialManagementStore()

  useEffect(() => {
    fetchPatrimonialItens();
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Stack sx={{ alignItems: 'center', }} gap={5}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Stack sx={{ alignItems: 'center' }}>
            <Typography variant='h4'>Patrimônio Total:</Typography>
            <Typography variant='h2'>{formatToBrazilianReals(totalPatrimonyValue)}</Typography>
          </Stack>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography sx={{ flex: 1, fontSize: 20, fontWeight: '500' }}>Lista de Patrimônios:</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleOpen}
                  >
                    Cadastrar novo patrimômio
                  </Button>
                </Box>
                {patrimonialItens && patrimonialItens.length > 0 && <PatrimonialItemList PatrimonialItens={patrimonialItens} handleOpenDetails={handleOpenDetails} />}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Stack>

      <ModalPatrimonios
        open={isModalOpen}
        onClose={handleClose}
      />

      <PatrimonialItemDetailsModal
        open={!!selectedItem}
        onClose={handleCloseDetails}
        item={selectedItem}
        onPayInstallment={handlePayInstallment}
      />
    </Box>
  );
};