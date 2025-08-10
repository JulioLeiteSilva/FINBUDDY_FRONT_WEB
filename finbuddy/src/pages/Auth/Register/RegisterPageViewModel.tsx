import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchemaType } from '../../../schemas/Auth';

import { useLoadingStore } from '../../../store/loadingStore';
import { Register } from '../../../services/Auth';

export const useRegisterPageViewModel = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { isLoading, startLoading, stopLoading } = useLoadingStore();

  const onSubmit = async (data: RegisterSchemaType) => {
    startLoading();
    try {
      Register(
        data,
        login,
        startLoading,
        stopLoading
      );
      navigate('/');
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };

  return {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    register,
    handleSubmit,
    errors,
    isLoading,
    onSubmit,
  };
};
