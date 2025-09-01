import { useBanks } from "../../../../hooks/useBanks";
import { DeleteBankAccount, UpdateBankAccount } from "../../../../services/BankAccount";
import dayjs from 'dayjs';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { BankAccountCardProps } from "./BankAccountCardModel";
import { DeleteBankAccountRequestType, UpdateBankAccountRequestType } from "../../../../schemas/BankAccount";
import { useState } from "react";

export const useBankAccountCardViewModel = (props: BankAccountCardProps) => {
    const { selectedMonth, bankAccount } = props;

    dayjs.extend(isSameOrBefore);
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const { banks } = useBanks();
    const [openModal, setOpenModal] = useState(false);
    const today = dayjs().tz("America/Sao_Paulo");

    // 2. Calcule tudo o que você precisa DIRETAMENTE
    const isCurrentMonth = selectedMonth.isSame(today, 'month');
    const isFutureMonth = selectedMonth.isAfter(today, 'month');
    const isPastMonth = selectedMonth.isBefore(today, 'month');

    // Calcule as flags de visibilidade diretamente
    const showCurrentBalance = isCurrentMonth;
    const showForecastBalance = isCurrentMonth || isFutureMonth;
    const showPastMonthBalance = isPastMonth;


    // Obtenha os saldos diretamente, com valores padrão para segurança
    const actualBalance = bankAccount?.balance ?? 0;
    const forecastBalance = bankAccount?.forecastBankAccountBalance ?? 0;
    const pastMonthBalance = bankAccount?.pastMonthBankAccountBalance ?? 0;

    // REMOVIDO: Todo o bloco useEffect foi deletado por ser desnecessário.
    // REMOVIDO: Todos os useStates para saldos e visibilidade foram deletados.

    const matchedBank = banks.find((bank) => bank.code === bankAccount?.bank);

    const handleDelete = async (data: DeleteBankAccountRequestType) => {
        await DeleteBankAccount(data);
        setOpenModal(false);
    };

    const handleUpdate = async (body: UpdateBankAccountRequestType) => {
        await UpdateBankAccount(body);
        setOpenModal(false);
    };

    return {
        setOpenModal,
        openModal,
        handleDelete,
        handleUpdate,
        matchedBank,
        actualBalance,
        forecastBalance,
        pastMonthBalance,
        showCurrentBalance,
        showForecastBalance,
        showPastMonthBalance
    }
}