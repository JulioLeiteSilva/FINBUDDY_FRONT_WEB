export enum AccountType {
    WALLET = "WALLET", // Carteira
    CHECKING = "CHECKING", // Conta Corrente
    SAVINGS = "SAVINGS", // Poupança
    INVESTMENT = "INVESTMENT", // Conta de Investimento
    OTHER = "OTHER", // Outro
}

export const getAccountTypeLabel = (type: AccountType): string => {
    switch (type) {
        case AccountType.WALLET:
            return "Carteira";
        case AccountType.CHECKING:
            return "Conta Corrente";
        case AccountType.SAVINGS:
            return "Poupança";
        case AccountType.INVESTMENT:
            return "Investimento";
        case AccountType.OTHER:
            return "Outro";
        default:
            return type;
    }
};

export const AccountTypeLabels: Record<AccountType, string> = {
    [AccountType.CHECKING]: 'Conta Corrente',
    [AccountType.SAVINGS]: 'Poupança',
    [AccountType.INVESTMENT]: 'Investimento',
    [AccountType.WALLET]: 'Carteira',
    [AccountType.OTHER]: 'Outro',
};
