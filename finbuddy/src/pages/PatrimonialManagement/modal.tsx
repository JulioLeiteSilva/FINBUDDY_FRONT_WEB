import { useState } from 'react';
import {
  Button,
  Typography,
  Modal,
  Box,
  TextField,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

// Interface para definir os tipos das props do componente do Modal
interface MeuModalProps {
  open: boolean;
  onClose: () => void;
}

export const ModalPatrimonios = ({ open, onClose }: MeuModalProps) => {
  const [selectedTipo, setSelectedTipo] = useState<'ativo' | 'passivo' | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string>('');

  const handleAssetTypeChange = (event: any) => {
    setSelectedAssetType(event.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600, md: 700 },
          maxHeight: '90%',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Cadastro de Patrimônio
        </Typography>
        <Typography id="modal-description" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
          Preencha os valores para o cadastro de um novo patrimônio.
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>Tipo de Patrimônio</Typography>
          <ButtonGroup variant="outlined" aria-label="outlined button group" sx={{ width: '50%' }}>
            <Button
              onClick={() => setSelectedTipo('ativo')}
              variant={selectedTipo === 'ativo' ? 'contained' : 'outlined'}
            >
              Ativo
            </Button>
            <Button
              onClick={() => setSelectedTipo('passivo')}
              variant={selectedTipo === 'passivo' ? 'contained' : 'outlined'}
            >
              Passivo
            </Button>
          </ButtonGroup>
        </Box>

        {selectedTipo === 'passivo' && (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Valor Total da Dívida"
              type="number"
              name="totalDebtAmount"
              required
              InputProps={{ inputProps: { min: 0.01 } }}
            />
            <TextField
              fullWidth
              label="Taxa de Juros (%)"
              type="number"
              name="interestRate"
              required
              InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
            />
            <TextField
              fullWidth
              label="Prazo (em meses)"
              type="number"
              name="term"
              required
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              fullWidth
              label="Valor da Parcela"
              type="number"
              name="installmentValue"
              required
              InputProps={{ inputProps: { min: 0.01 } }}
            />
          </Box>
        )}

        {selectedTipo === 'ativo' && (
          <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="asset-type-label">Tipo de Ativo</InputLabel>
              <Select
                labelId="asset-type-label"
                id="asset-type"
                value={selectedAssetType}
                label="Tipo de Ativo"
                onChange={handleAssetTypeChange}
              >
                <MenuItem value="Acoes">Ações</MenuItem>
                <MenuItem value="Bens Materiais">Bens Materiais</MenuItem>
              </Select>
            </FormControl>

            {selectedAssetType === 'Acoes' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Ativo</InputLabel>
                  <Select name="assetType" label="Tipo de Ativo" defaultValue="">
                    <MenuItem value="Renda Fixa">Renda Fixa</MenuItem>
                    <MenuItem value="Acoes">Ações</MenuItem>
                    <MenuItem value="FII">FII</MenuItem>
                    <MenuItem value="Cripto">Cripto</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Nome" name="name" required />
                <TextField fullWidth label="Quantidade" type="number" name="quantity" required InputProps={{ inputProps: { min: 0.01 } }} />
                <TextField fullWidth label="Custo Médio" type="number" name="avgCost" required InputProps={{ inputProps: { min: 0.01 } }} />
                <TextField fullWidth label="Tag" name="tag" />
              </Box>
            )}

            {selectedAssetType === 'Bens Materiais' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Bem</InputLabel>
                  <Select name="type" label="Tipo de Bem" defaultValue="">
                    <MenuItem value="Imovel">Imóvel</MenuItem>
                    <MenuItem value="Veiculo">Veículo</MenuItem>
                    <MenuItem value="Outro">Outro</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="Descrição" name="description" required />
                <TextField fullWidth label="Valor de Observação" type="number" name="observationValue" required InputProps={{ inputProps: { min: 0.01 } }} />
                <TextField fullWidth label="Valor Inicial" type="number" name="initialValue" required InputProps={{ inputProps: { min: 0.01 } }} />
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" color="primary">
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};