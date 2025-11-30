/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

// 1. Criação do "Adapter" para o MUI entender o componente de formatação
const NumericFormatCustom = React.forwardRef<HTMLInputElement, NumericFormatProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          // O segredo está aqui: devolvemos para o formulário o valor numérico puro (floatValue)
          // e simulamos um evento padrão do React
          onChange?.({
            target: {
              name: props.name,
              value: values.floatValue,
            },
          } as any);
        }}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale // Garante que sempre mostre ,00
        valueIsNumericString
      />
    );
  }
);

// 2. Tipagem do nosso componente customizado
type CurrencyInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
} & Omit<TextFieldProps, 'name' | 'variant'>; // Herda props do TextField (como error, helperText, etc)

// 3. O Componente final
export function CurrencyInput<T extends FieldValues>({ 
  name, 
  control, 
  label, 
  ...rest 
}: CurrencyInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, name, value, ref } }) => (
        <TextField
          {...rest}
          label={label}
          name={name}
          value={value}
          // Passamos a ref do RHF para o input interno
          inputRef={ref}
          // Importante: O onChange aqui recebe o evento simulado lá em cima
          onChange={onChange}
          fullWidth
          variant="outlined"
          // Aqui injetamos o componente de formatação dentro do TextField do MUI
          InputProps={{
            inputComponent: NumericFormatCustom as any,
            ...rest.InputProps, // Mantém outros InputProps se passados (ex: startAdornment)
          }}
        />
      )}
    />
  );
}