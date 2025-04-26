import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Formato de email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Formato de email inválido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(8),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // Indica qual campo exibir o erro
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;