import { AccountDisplayInfoProps } from "./AccountDisplayInfoModel";

export const useAccountDisplayInfo = (props: AccountDisplayInfoProps) => {
    const { bankAccount, banks } = props;

    const matchedBank = banks.find((b) => b.code === bankAccount.bank);
    const balanceFormatted = bankAccount.balance.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const balanceColor = bankAccount.balance >= 0 ? 'success.main' : 'error.main';

    return {
        matchedBank,
        balanceFormatted,
        balanceColor,
    }
}