import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { BankAccountType } from '../../../../schemas/BankAccount';
import { useBankAccountDetailsModalViewModel } from './BankAccountDetailsModalViewModel';
import { BankAccountDetailsModalProps } from './BankAccountDetailsModalModel';
import AccountDisplayInfoView from './components/AccountDisplayInfo/AccountDisplayInfoView';
import AccountEditFormView from './components/AccountEditForm/AccountEditFormView';

const BankAccountDetailsModalView = (props: BankAccountDetailsModalProps) => {
    const {
        isEditing,
        setIsEditing,
        register,
        handleSubmit,
        handleUpdate,
        handleDelete,
        onClose,
        control,
        errors,
        banks
    } = useBankAccountDetailsModalViewModel(props);

    return (
        <Dialog open={props.open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? 'Editar Conta' : 'Detalhes da Conta'}</DialogTitle>
            <DialogContent>
                {isEditing ? (
                    <AccountEditFormView
                        control={control}
                        register={register}
                        errors={errors}
                        banks={banks}
                    />
                ) : (
                    <AccountDisplayInfoView bankAccount={props.bankAccount as BankAccountType} banks={banks} />
                )}
            </DialogContent>
            <DialogActions>
                {isEditing ? (
                    <>
                        <Button onClick={() => setIsEditing(false)} color="secondary">Cancelar</Button>
                        <Button onClick={handleSubmit(handleUpdate)} color="primary">Salvar</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleDelete} color="error" sx={{ mr: 'auto' }}>Deletar</Button>
                        <Button onClick={onClose} color="secondary">Fechar</Button>
                        <Button onClick={() => setIsEditing(true)} color="primary">Editar</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
export default BankAccountDetailsModalView;