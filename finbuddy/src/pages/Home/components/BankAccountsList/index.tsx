import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { TransformedBankAccountSchemaType } from '../../../../schemas/BankAccount';
import { Bank } from '../../../../hooks/useBanks';
import { useNavigate } from 'react-router-dom';

interface BankAccountsListProps {
  bankAccounts: TransformedBankAccountSchemaType[];
  banks: Bank[];
  formatCurrency: (value: number) => string;
}

const BankAccountsList: React.FC<BankAccountsListProps> = ({
  bankAccounts,
  banks,
  formatCurrency,
}) => {
  const navigate = useNavigate();

  const getBankInfo = (bankCode: string) => {
    return banks.find(bank => bank.code === bankCode) || {
      name: 'Banco',
      logoUrl: 'https://logo.clearbit.com/bank.com'
    };
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
      onClick={() => navigate('/bank-accounts')}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Suas Contas
        </Typography>
        {bankAccounts.map((account) => {
          const bankInfo = getBankInfo(account.bank);
          return (
            <Box
              key={account.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={bankInfo.logoUrl}
                  alt={bankInfo.name}
                  sx={{ width: 32, height: 32 }}
                />
                <Box>
                  <Typography variant="body2">{account.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {bankInfo.name}
                  </Typography>
                </Box>
              </Box>
              <Typography
                color={account.balance >= 0 ? 'success.main' : 'error.main'}
                fontWeight="bold"
              >
                {formatCurrency(account.balance)}
              </Typography>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BankAccountsList; 