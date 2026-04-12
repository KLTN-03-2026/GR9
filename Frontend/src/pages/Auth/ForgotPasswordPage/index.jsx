import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "@/context/authContext";
import AuthFeaturePanel from "../../../components/AuthShare/AuthFeaturePanel";
import AuthCardShell from "../../../components/AuthShare/AuthCardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await requestPasswordReset(email);
      const targetEmail = response?.email || email;
      navigate(
        `/forgot-password/verify-otp?email=${encodeURIComponent(targetEmail)}`,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-stretch">
      <AuthFeaturePanel
        badge="Password Recovery"
        title="Regain access without the stress."
        description="We will send a secure OTP to your email so you can confirm ownership before setting a new password."
      />

      <AuthCardShell
        title="Forgot Password"
        description="Enter your email and we will send a one-time password to reset your account."
        footer={
          <p className="text-center text-sm font-medium text-on-surface-variant">
            Remember your password?
            <Button
              asChild
              variant="link"
              className="ml-1 h-auto p-0 font-bold text-primary underline-offset-4 hover:underline"
            >
              <Link to="/login">Back to login</Link>
            </Button>
          </p>
        }
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Email Address
            </Label>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="alex@example.com"
              className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest px-4 text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-primary/10"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="h-14 w-full rounded-xl bg-gradient-to-br from-primary to-primary-container text-lg font-bold text-on-primary shadow-[0_18px_35px_rgba(25,28,30,0.08)] transition-transform hover:scale-[1.01] active:scale-[0.98]"
          >
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </Button>
        </form>
      </AuthCardShell>
    </main>
  );
}
