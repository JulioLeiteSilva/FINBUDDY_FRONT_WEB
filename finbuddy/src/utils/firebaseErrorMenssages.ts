export const getFirebaseAuthErrorMessage = (code: string): string => {
    const messages: Record<string, string> = {
        'auth/invalid-email': 'E-mail inválido.',
        'auth/user-disabled': 'Usuário desativado.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
        'functions/unknown': 'Erro interno ao criar usuário. Tente novamente.',
        'functions/invalid-argument': 'Dados inválidos fornecidos.',
        'functions/permission-denied': 'Permissão negada.',
        'functions/not-found': 'Recurso não encontrado.',
        'functions/unauthenticated': 'Usuário não autenticado.',
        'functions/unavailable': 'Serviço indisponível. Tente novamente mais tarde.',
        'functions/internal': 'Erro interno no servidor.',
        // Adicione outros códigos conforme necessário
    };

    return messages[code] || 'Erro inesperado. Tente novamente.';
};