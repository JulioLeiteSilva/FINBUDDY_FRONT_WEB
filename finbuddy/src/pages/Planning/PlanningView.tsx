import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isBetween from "dayjs/plugin/isBetween";
import { usePlanningViewModel } from "./PlanningViewModel";
import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import { PlanningForm } from "./components/PlanningForm";
import { TabsContainer } from "./components/TabsContainer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const PlanningPage = () => {
  dayjs.extend(isBetween);
  dayjs.locale("pt-br");

  const {
    loading,
    selectedMonth,
    isCreatingPlanning,
    selectedTab,
    handlePreviousMonth,
    handleNextMonth,
    handleTabChange,
    handleOnClickCreatePlanning,
    hasRecords,
    tabsConfig,
  } = usePlanningViewModel();

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Card sx={{ minWidth: 900, minHeight: 400, p: 2 }}>
        {!isCreatingPlanning ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <IconButton onClick={handlePreviousMonth} size="large">
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  minWidth: { xs: "160px", sm: "200px" },
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              >
                {selectedMonth.format('MMMM [de] YYYY')}
              </Typography>
              <IconButton onClick={handleNextMonth} size="large">
                <ArrowForwardIosIcon />
              </IconButton>
            </div>

            {loading ? (
              <Typography variant="body1" align="center">
                Carregando dados...
              </Typography>
            ) : hasRecords ? (
              <TabsContainer
                tabs={tabsConfig}
                value={selectedTab}
                onChange={handleTabChange}
              />
            ) : (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Parece que você não tem registros para este mês.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={() => handleOnClickCreatePlanning(true)}
                >
                  Criar Planejamento
                </Button>
              </div>
            )}
          </>
        ) : (
          <PlanningForm />
        )}
      </Card>
    </Box>
  );
};
export default PlanningPage;
