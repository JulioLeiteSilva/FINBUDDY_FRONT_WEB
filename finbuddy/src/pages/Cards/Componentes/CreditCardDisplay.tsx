// src/components/CreditCardDisplay.tsx
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Link,
  styled,
  useTheme,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';

// --- INTERFACES E DADOS MOCKADOS ---

interface CardDetails {
  id: string;
  cardName: string;
  bankName: string;
  brand: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'OTHER';
  closingDay: number;
  dueDate: Date;
  invoiceTotal: number;
  limitTotal: number;
  amountSpent: number;
}

interface CreditCardDisplayProps {
  card?: CardDetails;
  onViewDetailsClick?: (cardId: string) => void;
  onEditClick?: (cardId: string) => void;
}

const defaultMockCardData: CardDetails = {
  id: 'mock-001',
  cardName: "Cartão Ultravioleta",
  bankName: "Nubank", // Mude para "Itau" ou "Banco do Brasil" para testar outras cores
  brand: 'MASTERCARD',
  closingDay: 28,
  dueDate: dayjs('2025-06-05').toDate(),
  invoiceTotal: 1250.77,
  limitTotal: 15000.00,
  amountSpent: 4300.50,
};

// --- CONFIGURAÇÕES DE ESTILO E FORMATAÇÃO ---

const bankColorMap: Record<string, string> = {
  nubank: '#820ad1',
  itau: '#ec7000',
  'banco do brasil': '#fddc01',
};

const bankTextColorMap: Record<string, string> = {
  'banco do brasil': '#003366', // Azul escuro para fundo amarelo
};

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
}));

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatCardBrand = (brand: string): string => {
  if (!brand || brand.length === 0) return '';
  return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
};


// --- COMPONENTE PRINCIPAL ---

const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({
  card: cardProp,
  onViewDetailsClick,
  onEditClick,
}) => {
  const theme = useTheme();
  const card = cardProp || defaultMockCardData;

  const { id, cardName, bankName, brand, closingDay, dueDate, invoiceTotal, limitTotal, amountSpent } = card;

  // Lógica de Cores - Revisada para garantir funcionamento
  const bankNameLower = bankName.toLowerCase();
  const cardBackgroundColor = bankColorMap[bankNameLower] || '#ffffff';
  
  // Define a cor de texto padrão para cards coloridos (branco ou a cor customizada do mapa)
  const coloredCardDefaultText = bankTextColorMap[bankNameLower] || '#ffffff';

  // Define as cores primárias e secundárias com base no fundo do card
  const primaryTextColor = cardBackgroundColor === '#ffffff' ? theme.palette.text.primary : coloredCardDefaultText;
  const secondaryTextColor = cardBackgroundColor === '#ffffff' ? theme.palette.text.secondary : 'rgba(255,255,255,0.7)';

  // Lógica de valores
  const usedPercentage = limitTotal > 0 ? (amountSpent / limitTotal) * 100 : 0;
  const availableLimit = limitTotal - amountSpent;

  // Lógica CORRIGIDA para formatar a data de fechamento
  const formattedClosingDate = useMemo(() => {
    const dueDateObj = dayjs(dueDate);
    // Se o dia do vencimento (ex: 5) for menor que o dia de fechamento (ex: 28),
    // o fechamento ocorreu no mês anterior.
    let closingDateMonthContext = dueDateObj;
    if (dueDateObj.date() < closingDay) {
      closingDateMonthContext = dueDateObj.subtract(1, 'month');
    }
    // Formata o dia e o mês correto
    return `${String(closingDay).padStart(2, '0')}/${closingDateMonthContext.format('MM')}`;
  }, [closingDay, dueDate]);

  const handleViewDetails = () => {
    if (onViewDetailsClick) onViewDetailsClick(id);
    console.log("Ver fatura do cartão:", id);
  };

  const handleEdit = () => {
    if (onEditClick) onEditClick(id);
    console.log("Editar cartão:", id);
  }

  return (
    <Card sx={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        minWidth: 280,
        maxWidth: 380,
        margin: 'auto',
        backgroundColor: cardBackgroundColor,
        color: primaryTextColor,
      }}>
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
          {`${cardName} ${formatCardBrand(brand)}`}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', mb: 1.5 }}>
            <Box>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', color: secondaryTextColor, textTransform: 'uppercase' }}>
                    Fechamento
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formattedClosingDate}
                </Typography>
            </Box>
             <Box>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', color: secondaryTextColor, textTransform: 'uppercase' }}>
                    Vencimento
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {dayjs(dueDate).format('DD/MM')}
                </Typography>
            </Box>
             <Box>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', color: secondaryTextColor, textTransform: 'uppercase' }}>
                    Fatura Atual
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: cardBackgroundColor === '#ffffff' ? theme.palette.error.main : coloredCardDefaultText }}>
                    {formatCurrency(invoiceTotal)}
                </Typography>
            </Box>
        </Box>

        <Box sx={{ mb: 0.5 }}>
          <StyledLinearProgress
            variant="determinate"
            value={usedPercentage}
            sx={{
              backgroundColor: cardBackgroundColor === '#ffffff' ? theme.palette.success.light : 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: cardBackgroundColor === '#ffffff' ? theme.palette.error.main : 'rgba(255,255,255,0.7)',
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: secondaryTextColor }}>
              Utilizado: {formatCurrency(amountSpent)}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: secondaryTextColor }}>
              Disponível: {formatCurrency(availableLimit)}
            </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleViewDetails}
            sx={{ fontWeight: 500, color: 'inherit', textDecoration: 'none' }}
          >
            Ver fatura &gt;
          </Link>
          <IconButton
            size="small"
            onClick={handleEdit}
            aria-label="editar cartão"
            sx={{ color: secondaryTextColor }}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreditCardDisplay;