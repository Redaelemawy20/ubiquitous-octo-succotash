import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { signupSchema } from "../../lib/validation";
import { signupUser } from "../../lib/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      navigate("/login");
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
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = signupSchema.parse(formData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...signupData } = validatedData;
      signupMutation.mutate(signupData);
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
      {/* Name Field */}
      <Input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className={inputClassName}
      />
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
      {/* Confirm Password Field */}
      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
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

      <div className="flex flex-col gap-2">
        {/* Sign up Button */}
        <Button type="submit" size="lg" className="w-full">
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
