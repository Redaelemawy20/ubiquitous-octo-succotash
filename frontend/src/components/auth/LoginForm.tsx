import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema } from "../../lib/validation";
import { loginUser, getCurrentUser } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
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
            email: formData.email,
          };
          login(fallbackUser);
        }
        navigate("/");
      } catch {
        // If getting user data fails, still proceed with fallback
        const fallbackUser = {
          _id: "user-id",
          name: "User",
          email: formData.email,
        };
        login(fallbackUser);
        navigate("/");
      }
    },
    onError: (error: Error) => {
      setErrors({ submit: error.message });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);
      loginMutation.mutate(validatedData);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "errors" in error) {
        const fieldErrors: Record<string, string> = {};
        (
          error as { errors: Array<{ path: string[]; message: string }> }
        ).errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };
  const inputClassName = "h-15";
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className={inputClassName}
      />

      {/* Password Field */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
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
      <div className="flex flex-col gap-2">
        {/* Login Button */}
        <Button type="submit" size="lg" className="w-full">
          Login
        </Button>
        {/* Forgot Password Link */}
        <div className="text-right">
          <a
            href="/forget-password"
            className="font-secondary text-destructive underline hover:text-primary/80 text-sm transition-colors"
          >
            Forgot password?
          </a>
        </div>
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
