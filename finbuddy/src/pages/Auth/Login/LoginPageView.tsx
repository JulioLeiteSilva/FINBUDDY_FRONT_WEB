import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  authButtonSx,
  authCardContainerSx,
  authCardPaperSx,
  authContentContainerSx,
  authFooterLinkSx,
  authFooterTypographySx,
  authFormStackSx,
  authLogoHeaderBoxSx,
  authLogoHeaderInnerBoxSx,
  authPageBackgroundSx,
  authPageContainerSx,
  authTextFieldSx,
} from "../authStyles";
import { FinbuddyLogoHeader } from "../../../components";
import { useLoginPageViewModel } from "./LoginPageViewModel";

const LoginPageView = () => {
  const {
    showPassword,
    setShowPassword,
    register,
    handleSubmit,
    errors,
    isLoading,
    onSubmit,
  } = useLoginPageViewModel();

  return (
    <Box sx={authPageContainerSx}>
      <Box sx={authPageBackgroundSx} />
      <Box sx={authContentContainerSx}>
        <Container maxWidth="sm" sx={authCardContainerSx}>
          <Paper elevation={6} sx={authCardPaperSx}>
            <Box
              mb={9}
              display="flex"
              justifyContent="center"
              sx={authLogoHeaderBoxSx}
            >
              <Box width={339} height={99} sx={authLogoHeaderInnerBoxSx}>
                <FinbuddyLogoHeader />
              </Box>
            </Box>

            <Stack spacing={3} sx={authFormStackSx}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                size="medium"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                sx={authTextFieldSx}
              />
              <TextField
                label="Senha"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                size="medium"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                sx={authTextFieldSx}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                sx={authButtonSx}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Entrar"
                )}
              </Button>
            </Stack>
            <Typography
              mt={3}
              mb={20}
              fontSize="0.875rem"
              sx={authFooterTypographySx}
            >
              Novo por aqui?{" "}
              <Link href="/register" underline="hover" sx={authFooterLinkSx}>
                Crie sua conta gratuitamente.
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPageView;
