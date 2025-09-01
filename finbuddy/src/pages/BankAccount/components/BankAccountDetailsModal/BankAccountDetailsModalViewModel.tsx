import { BankAccountDetailsModalProps } from "./BankAccountDetailsModalModel";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBanks } from '../../../../hooks/useBanks';
import { DeleteBankAccountRequestType, UpdateBankAccountRequestType, UpdateBankAccountSchema, UpdateBankAccountSchemaType } from "../../../../schemas/BankAccount";


export const useBankAccountDetailsModalViewModel = (props: BankAccountDetailsModalProps) => {
    const {
        open,
        bankAccount,
        onClose,
        onDelete,
        onUpdate,
    } = props;

    const [isEditing, setIsEditing] = useState(false);
    const { banks } = useBanks();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UpdateBankAccountSchemaType>({
        resolver: zodResolver(UpdateBankAccountSchema),
    });

    // Reseta o formulário e o estado de edição sempre que o modal for fechado ou a conta mudar
    useEffect(() => {
        if (open) {
            reset({
                name: bankAccount.name,
                type: bankAccount.type,
                bank: bankAccount.bank,
                currency: bankAccount.currency,
            });
        } else {
            setIsEditing(false);
        }
    }, [bankAccount, open, reset]);

    const handleUpdate = (form: UpdateBankAccountSchemaType) => {
        const body = { data: form } as unknown as UpdateBankAccountRequestType;
        onUpdate(body);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete({ data: { id: props.bankAccount.id } } as DeleteBankAccountRequestType);
        onClose();
    };

    return {
        isEditing,
        setIsEditing,
        register,
        handleSubmit,
        handleUpdate,
        handleDelete,
        onClose,
        control,
        reset,
        errors,
        banks
    }
}