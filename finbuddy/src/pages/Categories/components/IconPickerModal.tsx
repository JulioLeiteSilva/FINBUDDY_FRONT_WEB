// src/pages/Categories/IconPickerModal.tsx

import React, { useMemo, useState } from "react";
import {
    Box,
    Grid,
    IconButton,
    Tooltip,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    InputAdornment
} from "@mui/material";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import { muiIconsForPickerList } from '../../../config/muiIconList'; // Ajuste o caminho conforme seu projeto

interface IconPickerModalProps {
    open: boolean;
    onClose: () => void;
    onSelectIcon: (iconName: string) => void;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({ open, onClose, onSelectIcon }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIcons = useMemo(() => {
        if (!searchTerm) {
            return muiIconsForPickerList;
        }
        return muiIconsForPickerList.filter(icon =>
            icon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleIconClick = (iconName: string) => {
        onSelectIcon(iconName);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Selecionar Ícone
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="Pesquisar Ícone"
                    variant="outlined"
                    size="small"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }
                    }}
                />
                <Box sx={{ mt: 1, maxHeight: '60vh', overflowY: 'auto', p: 1 }}>
                    <Grid container spacing={1}>
                        {filteredIcons.map(({ name, component: IconComp }) => (
                            <Grid size={{ xs: 4, sm: 3, md: 2 }} key={name}>
                                <Tooltip title={name.replace('Icon', '')} placement="top">
                                    <IconButton
                                        onClick={() => handleIconClick(name)}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '8px',
                                            p: 1.5,
                                            '&:hover': { backgroundColor: 'action.hover' }
                                        }}
                                    >
                                        <IconComp sx={{ fontSize: 32, mb: 0.5 }} />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                width: '100%',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {name.replace('Icon', '')}
                                        </Typography>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        ))}
                    </Grid>
                    {filteredIcons.length === 0 && (
                        <Typography sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                            Nenhum ícone encontrado.
                        </Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};