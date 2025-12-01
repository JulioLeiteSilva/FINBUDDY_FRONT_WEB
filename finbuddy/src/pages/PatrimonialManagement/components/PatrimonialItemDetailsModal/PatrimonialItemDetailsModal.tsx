/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Chip,
    Divider,
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History'; // Ícone adicionado

import { mapAssetTypeToPortuguese, mapPatrimonialCategoryToPortuguese, mapTangibleGoodsTypeToPortuguese, patrimonialItemCategory } from '../../../../enums/patrimonialManagement';
import { AnyPatrimonialItemType, LiabilityItemType, AssetItemType, TangibleGoodsItemType } from '../../../../schemas/PatrimonialManagement/PatrimonialItem';
import { firestoreTimestampToDate } from '../../../Transactions/components/TransactionDetailsModal/utils/transactionUtils';


interface PatrimonialItemDetailsModalProps {
    open: boolean;
    onClose: () => void;
    item: AnyPatrimonialItemType | null;
    onPayInstallment?: (item: LiabilityItemType) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (date: Date | string) => {
    // console.log(date) // Removido log para limpar console
    const timestampDate = firestoreTimestampToDate(date);
    if (!timestampDate) return '-';
    return new Date(timestampDate).toLocaleDateString('pt-BR');
};

// Helper para extrair o valor correto do snapshot do histórico
const getValueFromSnapshot = (snapshot: any): number => {
    if (snapshot.category === patrimonialItemCategory.LIABILITY) {
        return snapshot.updatedDebtsAmount || 0;
    }
    // Verifica se é bem tangível (baseado no typo do schema 'obersationValue')
    if ('obersationValue' in snapshot) {
        return snapshot.obersationValue || 0;
    }
    // Caso padrão (Assets)
    return snapshot.value || 0;
};

export const PatrimonialItemDetailsModal = ({
    open,
    onClose,
    item,
    onPayInstallment
}: PatrimonialItemDetailsModalProps) => {

    // Lógica de ordenação do histórico
    const sortedHistory = useMemo(() => {
        console.log('Item History:', item?.history);
        if (!item || !item.history) return [];
        return [...item.history].sort((a, b) => {
            const dateA = firestoreTimestampToDate(a.timestamp);
            const dateB = firestoreTimestampToDate(b.timestamp);
            if (!dateA || !dateB) return 0;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
    }, [item]);

    if (!item) return null;

    const renderAssetDetails = (asset: AssetItemType) => (
        <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Tipo de Ativo</Typography>
                <Typography variant="body1">{mapAssetTypeToPortuguese(asset.AssetType)}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Quantidade</Typography>
                <Typography variant="body1">{asset.quantity}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Custo Médio</Typography>
                <Typography variant="body1">{formatCurrency(asset.avgCost)}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Valor Atual Total</Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">
                    {formatCurrency(asset.value)}
                </Typography>
            </Grid>
        </Grid>
    );

    const renderTangibleDetails = (tangible: TangibleGoodsItemType) => (
        <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Tipo</Typography>
                <Typography variant="body1">{mapTangibleGoodsTypeToPortuguese(tangible.type)}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Valor Inicial</Typography>
                <Typography variant="body1">{formatCurrency(tangible.initialValue)}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">Valor Atual (Observado)</Typography>
                <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(tangible.obersationValue)}
                </Typography>
            </Grid>
            {tangible.description && (
                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">Descrição</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {tangible.description}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );

    const renderLiabilityDetails = (liability: LiabilityItemType) => (
        <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Dívida Original</Typography>
                <Typography variant="body1">{formatCurrency(liability.totalDebtAmount)}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Taxa de Juros</Typography>
                <Typography variant="body1">{liability.interestRate}%</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Prazo (Meses)</Typography>
                <Typography variant="body1">{liability.term}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Valor da Parcela</Typography>
                <Typography variant="body1">{formatCurrency(liability.installmentValue)}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary">Saldo Devedor Atual</Typography>
                <Typography variant="h6" color="error.main">
                    {formatCurrency(liability.updatedDebtsAmount)}
                </Typography>
            </Grid>
        </Grid>
    );

    const isLiability = item.category === patrimonialItemCategory.LIABILITY;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm" // Mantive SM como no seu código, mas para tabelas grandes 'md' pode ser melhor
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" component="div">
                        {item.name}
                    </Typography>
                    <Chip
                        label={mapPatrimonialCategoryToPortuguese(item.category)}
                        size="small"
                        color={isLiability ? "error" : "success"}
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                    />
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Seção de Detalhes Principais */}
                <Box mb={2}>
                    <Box display="flex" alignItems="center" gap={1} mb={2} color="text.secondary">
                        <CalendarTodayIcon fontSize="small" />
                        <Typography variant="caption">
                            Criado em: {formatDate(item.onCreate)}
                        </Typography>
                    </Box>

                    {item.category === patrimonialItemCategory.LIABILITY ? (
                        renderLiabilityDetails(item as LiabilityItemType)
                    ) : 'AssetType' in item ? (
                        renderAssetDetails(item as AssetItemType)
                    ) : 'type' in item ? (
                        renderTangibleDetails(item as TangibleGoodsItemType)
                    ) : (
                        <Typography>Detalhes não disponíveis.</Typography>
                    )}
                </Box>

                {/* --- Seção de Histórico Adicionada --- */}
                <Divider sx={{ my: 3 }} />

                <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <HistoryIcon color="primary" />
                        <Typography variant="h6">Histórico de Alterações</Typography>
                    </Box>

                    {sortedHistory.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 250 }}>
                            <Table stickyHeader size="small" aria-label="tabela de historico">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Data</TableCell>
                                        <TableCell align="right">Valor no Registro</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedHistory.map((entry) => (
                                        <TableRow key={entry.id} hover>
                                            <TableCell component="th" scope="row">
                                                {formatDate(entry.timestamp)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(getValueFromSnapshot(entry.changes))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                            Nenhum histórico registrado para este item.
                        </Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Fechar
                </Button>

                {isLiability && onPayInstallment && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PaymentIcon />}
                        onClick={() => {
                            onPayInstallment(item as LiabilityItemType);
                        }}
                    >
                        Pagar Parcela
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};