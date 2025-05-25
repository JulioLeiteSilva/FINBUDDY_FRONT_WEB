import { AccountType } from '../../../../../enums/accountType';

export const getAccountTypeLabel = (type: AccountType): string => {
    const labels: Record<AccountType, string> = {
        [AccountType.CHECKING]: 'Conta Corrente',
        [AccountType.SAVINGS]: 'Poupança',
        [AccountType.INVESTMENT]: 'Investimento',
        [AccountType.WALLET]: 'Carteira',
        [AccountType.OTHER]: 'Outro',
    };
    return labels[type] || type;
};