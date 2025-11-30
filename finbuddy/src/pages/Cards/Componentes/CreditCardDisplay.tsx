/* eslint-disable react-hooks/rules-of-hooks */
// src/components/CreditCardDisplay.tsx
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Link,
  useTheme,
} from '@mui/material';
import { useBanks } from '../../../hooks/useBanks';
import { CardDetails } from '../utils/types';

// --- INTERFACES E DADOS MOCKADOS ---

interface CreditCardDisplayProps {
  card?: CardDetails;
  onViewDetailsClick?: (card: CardDetails) => void;
  onEditClick?: (card: CardDetails) => void;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- COMPONENTE PRINCIPAL ---

const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({
  card,
  onViewDetailsClick,
}) => {
  const theme = useTheme();
  const { banks } = useBanks();

  if (!card) return null;

  const { cardName, bankName, brand, closingDay, dueDate, limitTotal, invoices } = card;

  const bank = banks.find(b => b.name === bankName);

  const cardBackgroundColor = bank?.colors.primary || theme.palette.primary.main;
  const textColor = theme.palette.getContrastText(cardBackgroundColor);
  const secondaryTextColor = theme.palette.getContrastText(cardBackgroundColor) + '99';

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0) + brand.slice(1).toLowerCase();
  };

  const formattedClosingDate = `Dia ${closingDay}/${new Date().getMonth() + 1}`;
  const formattedDueDate = `Dia ${dueDate}/${new Date().getMonth() + 1}`;
  console.log(closingDay)
  console.log(dueDate)

  const currentInvoice = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    return invoices.find(inv => inv.month === currentMonth && inv.year === currentYear);
  }, [invoices]);

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
                    {formattedDueDate}
                </Typography>
            </Box>
             <Box>
                <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', color: secondaryTextColor, textTransform: 'uppercase' }}>
                    Fatura Atual
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: bank ? textColor : theme.palette.error.main }}>
                    {formatCurrency(currentInvoice?.total || 0)}
                </Typography>
            </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: secondaryTextColor }}>
              Limite disponível
            </Typography>
            <Typography variant="caption" sx={{ color: secondaryTextColor }}>
              {formatCurrency(limitTotal - (currentInvoice?.total || 0))}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={((currentInvoice?.total || 0) / limitTotal) * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: textColor,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => onViewDetailsClick?.(card)}
            sx={{
              color: textColor,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Ver fatura
          </Link>
          {/* <IconButton
            size="small"
            onClick={() => onEditClick?.(card)}
            sx={{ color: textColor }}
          >
            <EditIcon fontSize="small" />
          </IconButton> */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreditCardDisplay;