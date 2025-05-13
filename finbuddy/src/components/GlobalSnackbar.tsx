import { Alert, Snackbar } from '@mui/material';
import { useSnackbarStore } from '../store/useSnackbarStore';

const GlobalSnackbar = () => {
    const { open, message, type, closeSnackbar } = useSnackbarStore();

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={closeSnackbar} severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalSnackbar;
