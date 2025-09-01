import { Typography, Box, Avatar, Chip } from '@mui/material';
import { getAccountTypeLabel } from '../../../utils/bankAccountUtils';

import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import { AccountDisplayInfoProps, InfoRowProps } from './AccountDisplayInfoModel';
import { useAccountDisplayInfo } from './AccountDisplayInfoViewModel';

const InfoRow = (props: InfoRowProps) => {
    const { icon, label, value } = props;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, '& svg': { mr: 1.5, color: 'text.secondary' } }}>
            {icon}
            <Typography variant="body1">
                <Typography component="span" fontWeight="bold">{label}:</Typography> {value}
            </Typography>
        </Box>
    )
}

const AccountDisplayInfoView = (props: AccountDisplayInfoProps) => {
    const { bankAccount } = props;

    const {
        matchedBank,
        balanceFormatted,
        balanceColor,
    } = useAccountDisplayInfo(props);


    return (
        <Box>
            <InfoRow
                icon={<PersonIcon />}
                label="Nome"
                value={bankAccount.name}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <BusinessIcon />
                <Typography variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="span" fontWeight="bold" mr={0.5}>Banco:</Typography>
                    {matchedBank?.logoUrl && (
                        <Avatar
                            src={matchedBank.logoUrl}
                            alt={`Logo ${matchedBank.name}`}
                            sx={{ width: 24, height: 24, mr: 1, ml: 0.5 }}
                            slotProps={{ img: { style: { objectFit: 'contain' } } }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    )}
                    {matchedBank?.name || bankAccount.bank}
                </Typography>
            </Box>

            <InfoRow
                icon={<AttachMoneyIcon />}
                label="Saldo"
                value={
                    <Typography component="span" fontWeight="bold" color={balanceColor}>
                        R$ {balanceFormatted}
                    </Typography>
                }
            />
            <InfoRow
                icon={<CategoryIcon />}
                label="Tipo"
                value={
                    <Chip
                        label={getAccountTypeLabel(bankAccount.type)}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 0.5 }}
                    />
                }
            />
            <InfoRow
                icon={<PublicIcon />}
                label="Moeda"
                value={bankAccount.currency}
            />
        </Box>
    );
}
export default AccountDisplayInfoView;