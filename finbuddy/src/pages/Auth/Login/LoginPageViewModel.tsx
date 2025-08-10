import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "../../../schemas/Auth";

import { useLoadingStore } from "../../../store/loadingStore";
import { Login } from "../../../services/Auth";
import { useAuthStore } from "../../../store/authStore";

export const useLoginPageViewModel = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { startLoading, stopLoading, isLoading } = useLoadingStore();

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await Login(data.email, data.password, login, startLoading, stopLoading);
      navigate("/");
    } catch (err) {
      console.error("Erro ao logar:", err);
    }
  };

  return {
    showPassword,
    setShowPassword,
    register,
    handleSubmit,
    errors,
    isLoading,
    onSubmit,
  };
};
