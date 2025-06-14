import { useEffect, useState } from "react";

export interface Bank {
    code: string;
    name: string;
    fullName: string;
    ispb: string;
    logoUrl: string;
    colors: {
        primary: string;
        textColor: string;
    };
}

const FIXED_BANKS: Bank[] = [
    {
        code: "001",
        name: "Banco do Brasil",
        fullName: "Banco do Brasil S.A.",
        ispb: "00000000",
        logoUrl: "https://logo.clearbit.com/bb.com.br",
        colors: {
            primary: '#fddc01',
            textColor: '#003366'
        }
    },
    {
        code: "033",
        name: "Santander",
        fullName: "Banco Santander (Brasil) S.A.",
        ispb: "90400888",
        logoUrl: "https://logo.clearbit.com/santander.com.br",
        colors: {
            primary: '#ec0000',
            textColor: '#ffffff'
        }
    },
    {
        code: "104",
        name: "Caixa Econômica",
        fullName: "Caixa Econômica Federal",
        ispb: "00360305",
        logoUrl: "https://logo.clearbit.com/caixa.com.br",
        colors: {
            primary: '#005CA9',
            textColor: '#ffffff'
        }
    },
    {
        code: "237",
        name: "Bradesco",
        fullName: "Banco Bradesco S.A.",
        ispb: "60746948",
        logoUrl: "https://logo.clearbit.com/bradesco.com.br",
        colors: {
            primary: '#cc092f',
            textColor: '#ffffff'
        }
    },
    {
        code: "341",
        name: "Itaú",
        fullName: "Itaú Unibanco S.A.",
        ispb: "60701190",
        logoUrl: "https://logo.clearbit.com/itau.com.br",
        colors: {
            primary: '#ec7000',
            textColor: '#ffffff'
        }
    },
    {
        code: "212",
        name: "Banco Original",
        fullName: "Banco Original S.A.",
        ispb: "92894922",
        logoUrl: "https://logo.clearbit.com/original.com.br",
        colors: {
            primary: '#ff6b00',
            textColor: '#ffffff'
        }
    },
    {
        code: "260",
        name: "Nubank",
        fullName: "Nu Pagamentos S.A.",
        ispb: "18236120",
        logoUrl: "https://logo.clearbit.com/nubank.com.br",
        colors: {
            primary: '#820ad1',
            textColor: '#ffffff'
        }
    },
    {
        code: "290",
        name: "PagBank",
        fullName: "PagSeguro Internet S.A.",
        ispb: "08064701",
        logoUrl: "https://logo.clearbit.com/pagseguro.uol.com.br",
        colors: {
            primary: '#ffc800',
            textColor: '#000000'
        }
    },
    {
        code: "380",
        name: "PicPay",
        fullName: "PicPay Serviços S.A.",
        ispb: "10573521",
        logoUrl: "https://logo.clearbit.com/picpay.com",
        colors: {
            primary: '#21c25e',
            textColor: '#ffffff'
        }
    },
    {
        code: "756",
        name: "Sicredi",
        fullName: "Banco Cooperativo Sicredi S.A.",
        ispb: "01181521",
        logoUrl: "https://logo.clearbit.com/sicredi.com.br",
        colors: {
            primary: '#005CA9',
            textColor: '#ffffff'
        }
    },
];

export const useBanks = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simula tempo de carregamento inicial
        const timer = setTimeout(() => {
            setBanks(FIXED_BANKS);
            setLoading(false);
        }, 300); // 300ms só pra simular loading

        return () => clearTimeout(timer);
    }, []);

    return { banks, loading, error: null };
};
