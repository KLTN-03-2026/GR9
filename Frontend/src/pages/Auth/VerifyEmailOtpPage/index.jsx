import { useContext, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

export default function VerifyEmailOtpPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = useMemo(
    () => searchParams.get("email") || "",
    [searchParams],
  );
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { verifyEmailOtpAndLogin, resendEmailOtp } = useContext(AuthContext);

  const handleVerify = async () => {
    try {
      setLoading(true);
      await verifyEmailOtpAndLogin(email, otp);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await resendEmailOtp(email);
    } catch (error) {
      console.error(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-stretch">
      <AuthFeaturePanel
        badge="Email Security"
        title="One last step before takeoff."
        description="Verify your email with the OTP we just sent so your traveler account is protected from the start."
      />

      <AuthCardShell
        title="Verify Your Email"
        description="Enter the 6-digit OTP from your inbox to activate your account."
        footer={
          <p className="text-center text-sm font-medium text-on-surface-variant">
            Already verified?
            <Button
              asChild
              variant="link"
              className="ml-1 h-auto p-0 font-bold text-primary underline-offset-4 hover:underline"
            >
              <Link to="/login">Go to login</Link>
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
                type="email"
                placeholder="alex@example.com"
                className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest px-4 text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-primary/10"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Verification OTP
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
            {loading ? "Verifying..." : "Verify Account"}
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
