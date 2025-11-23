import React from 'react';
import { TextField } from '@mui/material';
import { NumericFormat } from 'react-number-format'; // Importação principal

// Interface para o componente customizado
interface CustomCurrencyProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    // O valor deve ser number, string ou undefined
    value: number | string | undefined;
}

// O componente que faz a mágica da formatação R$
export const NumericFormatCustom = React.forwardRef<typeof NumericFormat, CustomCurrencyProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    // 1. Garante que o RHF receba apenas o NÚMERO PURO (ex: "1000.50")
                    onChange({
                        target: {
                            name: props.name,
                            // floatValue é o número puro sem formatação R$ ou .
                            value: values.floatValue ? values.floatValue.toString() : '',
                        },
                    });
                }}
                // Configurações BRASILEIRAS (R$ 1.000,00)
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                // Usa o TextField do MUI como input base
                customInput={TextField}
            />
        );
    },
);