import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema } from "../../lib/validation";
import type { LoginFormData } from "../../lib/validation";
import { loginUser, getCurrentUser } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [backendError, setBackendError] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (_, variables) => {
      // Get real user data from backend after successful login
      try {
        const userData = await getCurrentUser();
        if (userData?.user) {
          login(userData.user);
        } else {
          // Fallback if profile endpoint fails
          const fallbackUser = {
            _id: "user-id",
            name: "User",
            email: variables.email,
          };
          login(fallbackUser);
        }
        navigate("/");
      } catch {
        // If getting user data fails, still proceed with fallback
        const fallbackUser = {
          _id: "user-id",
          name: "User",
          email: variables.email,
        };
        login(fallbackUser);
        navigate("/");
      }
    },
    onError: (error: Error) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setBackendError("");
    loginMutation.mutate(data);
  };
  const inputClassName = "h-15";
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Backend Error Message */}
      {backendError && (
        <div className="text-destructive text-sm font-medium text-center p-2 bg-destructive/10 rounded-md border border-destructive/20">
          {backendError}
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1">
        <Input
          type="email"
          placeholder="Email"
          {...register("email")}
          className={inputClassName}
        />
        {errors.email && (
          <p className="text-destructive text-sm font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className={inputClassName}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive text-sm font-medium">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {/* Login Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isValid || loginMutation.isPending || isSubmitting}
        >
          Login
        </Button>
      </div>
      {/* Sign Up Link line */}
      <div className="font-secondary text-center font-medium leading-[21px]">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className=" hover:text-primary underline transition-colors underline-offset-[22%]"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
