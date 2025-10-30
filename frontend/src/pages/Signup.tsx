import SignupForm from "../components/auth/SignupForm";
import { AuthLayout } from "../components/auth/AuthLayout";

export default function Signup() {
  return (
    <AuthLayout title="Sign up">
      <SignupForm />
    </AuthLayout>
  );
}
