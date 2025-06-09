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
import { useBanks } from '../../../hooks/useBanks';

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
  bankName: "Nubank",
  brand: 'MASTERCARD',
  closingDay: 28,
  dueDate: dayjs('2025-06-05').toDate(),
  invoiceTotal: 1250.77,
  limitTotal: 15000.00,
  amountSpent: 4300.50,
};

// --- CONFIGURAÇÕES DE ESTILO E FORMATAÇÃO ---

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
  const { banks } = useBanks();
  const card = cardProp || defaultMockCardData;

  const { id, cardName, bankName, brand, closingDay, dueDate, invoiceTotal, limitTotal, amountSpent } = card;

  // Encontra o banco correspondente
  const bank = banks.find(b => b.name.toLowerCase() === bankName.toLowerCase());
  
  // Define as cores do cartão
  const cardBackgroundColor = bank?.colors.primary || '#ffffff';
  const textColor = bank?.colors.textColor || theme.palette.text.primary;
  const secondaryTextColor = bank ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary;

  console.log(amountSpent)
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
        color: textColor,
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
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: bank ? textColor : theme.palette.error.main }}>
                    {formatCurrency(invoiceTotal)}
                </Typography>
            </Box>
        </Box>

        <Box sx={{ mb: 0.5 }}>
          <StyledLinearProgress
            variant="determinate"
            value={usedPercentage}
            sx={{
              backgroundColor: bank ? 'rgba(255,255,255,0.3)' : theme.palette.success.light,
              '& .MuiLinearProgress-bar': {
                backgroundColor: bank ? 'rgba(255,255,255,0.7)' : theme.palette.error.main,
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