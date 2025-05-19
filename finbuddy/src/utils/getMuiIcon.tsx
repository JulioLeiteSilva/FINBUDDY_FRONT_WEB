// src/utils/getMuiIcon.tsx
import React from 'react';
// Importa o mapa de componentes e o ícone de fallback padrão do arquivo de configuração
import { iconComponentsMap, DefaultFallbackIcon } from '../config/muiIconList'; // Ajuste o caminho

interface GetMuiIconProps {
    iconName?: string | null;
    fallbackIconName?: string; // Nome do ícone de fallback (opcional)
    [key: string]: unknown;
}

const GetMuiIcon: React.FC<GetMuiIconProps> = ({
    iconName,
    fallbackIconName, // Não tem mais valor padrão aqui, pois DefaultFallbackIcon é usado
    ...props
}) => {
    const IconComponent = iconName ? iconComponentsMap[iconName] : null;

    if (IconComponent) {
        return <IconComponent {...props} />;
    }

    // Se um nome de fallback específico foi fornecido e existe no mapa
    if (fallbackIconName && iconComponentsMap[fallbackIconName]) {
        console.warn(`Ícone "${iconName}" não encontrado. Usando fallback especificado "${fallbackIconName}".`);
        const FallbackSpecificComponent = iconComponentsMap[fallbackIconName];
        return <FallbackSpecificComponent {...props} />;
    }

    // Se nenhum fallback específico foi fornecido ou não foi encontrado, usa o DefaultFallbackIcon
    console.warn(`Ícone "${iconName}" não encontrado. Usando fallback padrão.`);
    return <DefaultFallbackIcon {...props} />;
};

export default GetMuiIcon;
