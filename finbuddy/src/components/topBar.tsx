import { AppBar, Avatar, Box, Button, IconButton, Toolbar, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { deepPurple } from '@mui/material/colors';
import { useSideBarStore } from '../store/sideBarStore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuthStore } from '../store/authStore';

interface TopBarProps {
    onOpenNewTransactionModal: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenNewTransactionModal }) => {
    const { user } = useAuthStore();
    const { toggleSideBarCollapsed, isSideBarCollapsed } = useSideBarStore();
    const theme = useTheme();
    const drawerWidth = isSideBarCollapsed ? theme.spacing(5) : theme.spacing(22);

    const getInitials = (email: string | null): string => {
        if (!email) {
            return '??';
        }
        const emailParts = email.split('@')[0];
        if (emailParts.length >= 2) {
            return emailParts.substring(0, 2).toUpperCase();
        } else if (emailParts.length === 1) {
            return emailParts.toUpperCase();
        }
        return email.substring(0, Math.min(email.length, 2)).toUpperCase();
    };

    const userInitials = user ? getInitials(user.email) : '??';

    return (
        <AppBar
            position="static"
            sx={{
                width: '100%',
                position: 'fixed',
                zIndex: theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={toggleSideBarCollapsed} color="inherit" aria-label="toggle sidebar">
                    {isSideBarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: drawerWidth }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ mr: 2 }}
                        onClick={onOpenNewTransactionModal}
                    >
                        Nova Transação
                    </Button>
                    <IconButton color="inherit">
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>{userInitials}</Avatar>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;