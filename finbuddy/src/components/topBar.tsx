import { AppBar, Avatar, Box, Button, IconButton, Toolbar, useTheme} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { deepPurple } from '@mui/material/colors';
import { useSideBarStore } from '../store/sideBarStore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const TopBar = () => {
    const { toggleSideBarCollapsed, isSideBarCollapsed } = useSideBarStore();
    const theme = useTheme();
    const drawerWidth = isSideBarCollapsed ? theme.spacing(5) : theme.spacing(22);

    return (
        <AppBar
            position="static"
            sx={{
                width: '100%',
                position: 'fixed',
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
                    >
                        Nova Transação
                    </Button>
                    <IconButton color="inherit">
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>OP</Avatar>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;