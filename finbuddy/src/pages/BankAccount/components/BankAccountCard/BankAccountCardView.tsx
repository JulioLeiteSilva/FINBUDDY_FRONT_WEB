import { Avatar, Card, CardContent, Typography, Box } from "@mui/material";
import { BankAccountCardProps } from "./BankAccountCardModel";
import { useBankAccountCardViewModel } from "./BankAccountCardViewModel";
import BankAccountDetailsModalView from "../BankAccountDetailsModal/BankAccountDetailsModalView";
import { BankAccountType } from "../../../../schemas/BankAccount";

export const BankAccountCardView = (props: BankAccountCardProps) => {
    const {
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
    } = useBankAccountCardViewModel(props);
    return (
        <>
            <Card sx={{ mb: 1, cursor: "pointer" }} onClick={() => setOpenModal(true)}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {matchedBank && (
                            <Avatar
                                src={matchedBank.logoUrl}
                                alt={matchedBank.name}
                                sx={{ width: 40, height: 40 }}
                            />
                        )}
                        <Box>
                            <Typography variant="subtitle1" component="div">
                                {props.bankAccount.name}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                {matchedBank?.name || props.bankAccount.bank}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        {showCurrentBalance &&
                            (
                                <Typography variant="body1" fontWeight="bold">
                                    Saldo Atual: {actualBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </Typography>
                            )}
                        {showForecastBalance &&
                            (
                                <Typography variant="body2" color="text.secondary">
                                    Saldo previsto: {forecastBalance.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </Typography>
                            )}
                        {showPastMonthBalance &&
                            (
                                <Typography variant="body2" color="text.secondary">
                                    Saldo no final do mês: {pastMonthBalance.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </Typography>
                            )}

                    </Box>
                </CardContent>
            </Card>

            <BankAccountDetailsModalView
                open={openModal}
                bankAccount={props.bankAccount as unknown as BankAccountType}
                onClose={() => setOpenModal(false)}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </>
    );
}