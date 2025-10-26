import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AccountType } from "../../../../enums/accountType";
import { useBanks } from "../../../../hooks/useBanks";
import { NewBankAccountModalProps } from "./NewBankAccountModalModel";
import { CreateBankAccountRequestType, CreateBankAccountSchema, CreateBankAccountType } from "../../../../schemas/BankAccount";

export const useNewBankAccountModalViewModel = (props: NewBankAccountModalProps) => {
    const { onClose, onCreateNew } = props;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<CreateBankAccountType>({
        resolver: zodResolver(CreateBankAccountSchema),
        defaultValues: {
            name: "",
            type: AccountType.CHECKING,
            bank: "",
            balance: 0,
            currency: "BRL",
        },
    });

    const { banks, loading: loadingBanks } = useBanks();

    const onSubmit = (data: CreateBankAccountType) => {
        const body = data as unknown as CreateBankAccountRequestType;
        onCreateNew(body);
        onClose();
        reset();
    };

    return {
        register,
        handleSubmit,
        errors,
        control,
        banks,
        loadingBanks,
        onSubmit
    };
}