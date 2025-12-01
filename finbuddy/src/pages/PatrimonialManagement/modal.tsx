import {
  Button,
  Typography,
  Modal,
  Box,
  TextField,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  formPatrimonySchema,
  FormPatrimonyType,
} from "../../schemas/PatrimonialManagement/Forms/CreatePatrimonialItem";

import {
  AssetSubtype,
  AssetType,
  patrimonialItemCategory,
  TangibleGoodsType,
} from "../../enums/patrimonialManagement";
import { CreatePatrimonialItemRequestType } from "../../schemas/PatrimonialManagement/Functions/CreatePatrimonialItem/CreatePatrimonialItemRequest";
import { CreatePatrimonialItem } from "../../services/PatrimonialManagement/createPatrimonialItem";
import dayjs from "dayjs";
import { usePatrimonialManagementStore } from "../../store/patrimonialManagementStore";
import { CurrencyInput } from "../../components/CurrencyInput/CurrencyInput";

interface MeuModalProps {
  open: boolean;
  onClose: () => void;
}

export const ModalPatrimonios = ({ open, onClose }: MeuModalProps) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormPatrimonyType>({
    resolver: zodResolver(formPatrimonySchema),
    defaultValues: {
      patrimonyType: patrimonialItemCategory.ASSET,
      assetSubtype: undefined,
      name: "",
    },
  });
  const { fetchPatrimonialItens } = usePatrimonialManagementStore();
  const today = dayjs().toDate();

  const selectedPatrimonyType = watch("patrimonyType");
  const selectedAssetSubtype = watch("assetSubtype");

  const handleFormSubmit = (data: FormPatrimonyType) => {
    console.log("Formulário válido! Enviando dados:", data);
    let body: CreatePatrimonialItemRequestType;

    if (data.patrimonyType === patrimonialItemCategory.ASSET) {
      if (data.assetSubtype === AssetSubtype.ASSETS) {
        body = {
          name: data.name!,
          onCreate: today,
          category: data.patrimonyType,
          AssetType: data.assetType,
          quantity: data.quantity,
          avgCost: data.avgCost,
        } as CreatePatrimonialItemRequestType;
      } else {
        body = {
          name: data.name!,
          onCreate: today as unknown as Date,
          category: data.patrimonyType,
          type: data.type,
          obersationValue: data.observationValue,
          initialValue: data.initialValue,
        } as CreatePatrimonialItemRequestType;
      }
    } else {
      body = {
        name: data.name!,
        onCreate: today as unknown as Date,
        category: data.patrimonyType,
        updatedDebtsAmount: data.totalDebtAmount,
        totalDebtAmount: data.totalDebtAmount,
        interestRate: data.interestRate,
        term: data.term,
        installmentValue: data.installmentValue,
      } as CreatePatrimonialItemRequestType;
    }

    CreatePatrimonialItem(body);
    fetchPatrimonialItens();

    reset();
    onClose();
  };

  const handleCloseModal = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600, md: 700 },
          maxHeight: "90%",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Cadastro de Patrimônio
        </Typography>
        <Typography
          id="modal-description"
          sx={{ mt: 1, mb: 2, color: "text.secondary" }}
        >
          Preencha os valores para o cadastro de um novo patrimônio.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          sx={{ mb: 2 }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Tipo de Patrimônio
            </Typography>
            <Controller
              name="patrimonyType"
              control={control}
              render={({ field }) => (
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                  sx={{ width: "50%" }}
                >
                  <Button
                    onClick={() => {
                      reset();
                      field.onChange(patrimonialItemCategory.ASSET);
                    }}
                    variant={
                      field.value === patrimonialItemCategory.ASSET
                        ? "contained"
                        : "outlined"
                    }
                  >
                    Ativo
                  </Button>
                  <Button
                    onClick={() => {
                      reset();
                      field.onChange(patrimonialItemCategory.LIABILITY);
                    }}
                    variant={
                      field.value === patrimonialItemCategory.LIABILITY
                        ? "contained"
                        : "outlined"
                    }
                  >
                    Passivo
                  </Button>
                </ButtonGroup>
              )}
            />
            {errors.patrimonyType && (
              <FormHelperText error>
                {errors.patrimonyType.message}
              </FormHelperText>
            )}
          </Box>
          {selectedPatrimonyType === patrimonialItemCategory.LIABILITY && (
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                {...register("name")}
                fullWidth
                label="Nome da Dívida"
                required
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <CurrencyInput
                control={control}
                name="totalDebtAmount"
                label="Valor Total da Dívida"
                fullWidth
                required
                error={!!errors.totalDebtAmount}
                helperText={errors.totalDebtAmount?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
              />
              <TextField
                {...register("interestRate")}
                fullWidth
                label="Taxa de Juros (%)"
                type="number"
                required
                error={!!errors.interestRate}
                helperText={errors.interestRate?.message}
                InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
              />
              <TextField
                {...register("term")}
                fullWidth
                label="Prazo (em meses)"
                type="number"
                required
                error={!!errors.term}
                helperText={errors.term?.message}
                InputProps={{ inputProps: { min: 1 } }}
              />
              <CurrencyInput
                control={control}
                name="installmentValue"
                label="Valor da Parcela"
                fullWidth
                required
                error={!!errors.installmentValue}
                helperText={errors.installmentValue?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {selectedPatrimonyType === patrimonialItemCategory.ASSET && (
            <Box
              sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Controller
                name="assetSubtype"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.assetSubtype}>
                    <InputLabel id="asset-type-label">Tipo de Ativo</InputLabel>
                    <Select
                      {...field}
                      value={field.value || ""}
                      labelId="asset-type-label"
                      label="Tipo de Ativo"
                    >
                      <MenuItem value={AssetSubtype.ASSETS}>
                        Ativos Financeiros (Ações, FIIs...)
                      </MenuItem>
                      <MenuItem value={AssetSubtype.TANGIBLE_GOODS}>
                        Bens Materiais (Carro, Imóvel...)
                      </MenuItem>
                    </Select>
                    {errors.assetSubtype && (
                      <FormHelperText>
                        {errors.assetSubtype.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {selectedAssetSubtype === AssetSubtype.ASSETS && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Controller
                    name="assetType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.assetType}>
                        <InputLabel>Tipo de Ativo Financeiro</InputLabel>
                        <Select
                          {...field}
                          value={field.value || ""}
                          label="Tipo de Ativo Financeiro"
                        >
                          <MenuItem value={AssetType.FIXED_INCOME}>
                            Renda Fixa
                          </MenuItem>
                          <MenuItem value={AssetType.STOCKS}>Ações</MenuItem>
                          <MenuItem value={AssetType.REIT}>FII</MenuItem>
                          <MenuItem value={AssetType.CRYPTOCURRENCY}>
                            Cripto
                          </MenuItem>
                        </Select>
                        {errors.assetType && (
                          <FormHelperText>
                            {errors.assetType.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                  <TextField
                    {...register("name")}
                    fullWidth
                    label="Nome do Ativo (Ex: ITUB4, Tesouro Selic 2029)"
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <TextField
                    {...register("quantity")}
                    fullWidth
                    label="Quantidade"
                    type="number"
                    required
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    InputProps={{ inputProps: { min: 0.01 } }}
                  />
                  <CurrencyInput
                    control={control}
                    name="avgCost"
                    label="Custo Médio"
                    fullWidth
                    required
                    error={!!errors.avgCost}
                    helperText={errors.avgCost?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    {...register("tag")}
                    fullWidth
                    label="Tag (Opcional, ex: 'Reserva')"
                    error={!!errors.tag}
                    helperText={errors.tag?.message}
                  />
                </Box>
              )}

              {selectedAssetSubtype === AssetSubtype.TANGIBLE_GOODS && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.type}>
                        <InputLabel>Tipo de Bem</InputLabel>
                        <Select
                          {...field}
                          value={field.value || ""}
                          label="Tipo de Bem"
                        >
                          <MenuItem value={TangibleGoodsType.REAL_ESTATE}>
                            Imóvel
                          </MenuItem>
                          <MenuItem value={TangibleGoodsType.VEHICLE}>
                            Veículo
                          </MenuItem>
                          <MenuItem value={TangibleGoodsType.JEWELRY}>
                            Joia
                          </MenuItem>
                          <MenuItem value={TangibleGoodsType.ELECTRONICS}>
                            Eletrônicos
                          </MenuItem>
                          <MenuItem value={TangibleGoodsType.ART}>
                            Arte
                          </MenuItem>
                          <MenuItem value={TangibleGoodsType.FURNITURE}>
                            Móvel
                          </MenuItem>
                          <MenuItem value={TangibleGoodsType.OTHER}>
                            Outro
                          </MenuItem>
                        </Select>
                        {errors.type && (
                          <FormHelperText>{errors.type.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                  <TextField
                    {...register("name")}
                    fullWidth
                    label="Nome / Descrição (Ex: 'Corolla 2017', 'Apto Praia')"
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <CurrencyInput
                    control={control}
                    name="observationValue"
                    label="Valor de Observação (Valor Atual)"
                    fullWidth
                    required
                    error={!!errors.observationValue}
                    helperText={errors.observationValue?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                  />
                  <CurrencyInput
                    control={control}
                    name="initialValue"
                    label="Valor Inicial (Quanto você pagou)"
                    fullWidth
                    required
                    error={!!errors.initialValue}
                    helperText={errors.initialValue?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={handleCloseModal} color="inherit">
              Cancelar
            </Button>

            <Button type="submit" variant="contained" color="primary">
              Cadastrar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
