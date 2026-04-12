import { useContext, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "@/context/authContext";
import AuthFeaturePanel from "../../../components/AuthShare/AuthFeaturePanel";
import AuthCardShell from "../../../components/AuthShare/AuthCardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyResetPasswordOtpPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = useMemo(
    () => searchParams.get("email") || "",
    [searchParams],
  );
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { requestPasswordReset, verifyPasswordResetOtp } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      setLoading(true);
      await verifyPasswordResetOtp(email, otp);
      navigate(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await requestPasswordReset(email);
    } catch (error) {
      console.error(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-stretch">
      <AuthFeaturePanel
        badge="OTP Challenge"
        title="Check your inbox for the reset code."
        description="Enter the one-time password we emailed you, then we will take you to the new password screen."
      />

      <AuthCardShell
        title="Verify Reset OTP"
        description="Use the 6-digit OTP from your email to continue."
        footer={
          <p className="text-center text-sm font-medium text-on-surface-variant">
            Need a different email?
            <Button
              asChild
              variant="link"
              className="ml-1 h-auto p-0 font-bold text-primary underline-offset-4 hover:underline"
            >
              <Link to="/forgot-password">Start again</Link>
            </Button>
          </p>
        }
      >
        <div className="space-y-6">
          <div className="space-y-4">
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

            <div className="space-y-1.5">
              <Label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Reset OTP
              </Label>
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                pattern={/^\d+$/}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            onClick={() => handleVerify()}
            disabled={loading}
            size="lg"
            className="h-14 w-full rounded-xl bg-gradient-to-br from-primary to-primary-container text-lg font-bold text-on-primary shadow-[0_18px_35px_rgba(25,28,30,0.08)] transition-transform hover:scale-[1.01] active:scale-[0.98]"
          >
            {loading ? "Checking OTP..." : "Continue"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={resendLoading}
            onClick={handleResend}
            className="h-12 w-full rounded-xl border-outline-variant/30 bg-surface-container-lowest text-sm font-semibold text-on-surface"
          >
            {resendLoading ? "Resending OTP..." : "Resend OTP"}
          </Button>
        </div>
      </AuthCardShell>
    </main>
  );
}
