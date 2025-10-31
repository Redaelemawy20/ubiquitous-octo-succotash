import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema } from "../../lib/validation";
import type { SignupFormData } from "../../lib/validation";
import { signupUser } from "../../lib/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [backendError, setBackendError] = useState<string>("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error: Error) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setBackendError("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...signupData } = data;
    signupMutation.mutate(signupData);
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

      {/* Name Field */}
      <div className="space-y-1">
        <Input
          type="text"
          placeholder="Name"
          {...register("name")}
          className={inputClassName}
        />
        {errors.name && (
          <p className="text-destructive text-sm font-medium">
            {errors.name.message}
          </p>
        )}
      </div>

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

      {/* Confirm Password Field */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className={inputClassName}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive text-sm font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {/* Sign up Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isValid || signupMutation.isPending || isSubmitting}
        >
          Sign up
        </Button>
      </div>
      {/* Sign Up Link line */}
      <div className="font-secondary text-center font-medium leading-[21px]">
        Already have an account?{" "}
        <Link
          to="/login"
          className=" hover:text-primary underline transition-colors underline-offset-[22%]"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
