import { AccountType, AccountTypeLabels } from '../../../../enums/accountType';

export const getAccountTypeLabel = (type: AccountType): string => {
    return AccountTypeLabels[type] || type;
};