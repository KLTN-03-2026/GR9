import { useContext, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Mail, RefreshCw, ShieldCheck } from "lucide-react";

import AuthContext from "@/context/authContext";
import heroImage from "@/assets/redesign/bay-hero.png";
import AuthCardShell from "../../../components/AuthShare/AuthCardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useI18n } from "@/i18n/I18nProvider";
import { buildAuthCopy } from "@/pages/Auth/auth-copy";

function FieldShell({ icon: Icon, children }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/42">
        <Icon className="size-4" />
      </div>
      {children}
    </div>
  );
}

export default function VerifyEmailOtpPage() {
  const [searchParams] = useSearchParams();
  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { verifyEmailOtpAndLogin, resendEmailOtp } = useContext(AuthContext);
  const { language } = useI18n();
  const copy = buildAuthCopy(language).verifyEmailPage;

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
    <AuthCardShell
      title={copy.shellTitle}
      description={copy.shellDescription}
      image={heroImage}
      visualBadge={copy.journeyLabel}
      visualTitle={copy.journeyTitle}
      visualMeta={copy.journeyDates}
      footer={
        <p className="text-center text-sm">
          {copy.footerText}
          <Link
            to="/login"
            className="ml-1 font-semibold text-[#d9b782] transition hover:text-white"
          >
            {copy.footerLink}
          </Link>
        </p>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleVerify();
        }}
      >
        <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
          <ShieldCheck className="size-3.5 text-[#d9b782]" />
          {copy.infoEyebrow}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
            {copy.emailLabel}
          </label>
          <FieldShell icon={Mail}>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder={copy.emailPlaceholder}
              className="h-11 rounded-[15px] rounded-tr-[8px] border-white/12 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-white/32 focus-visible:border-[#d9b782] focus-visible:ring-[#d9b782]/12"
            />
          </FieldShell>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
            {copy.otpLabel}
          </label>
          <div className="rounded-[18px] border border-white/12 bg-white/[0.04] px-3 py-3">
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
              pattern={/^\d+$/}
              containerClassName="justify-center"
            >
              <InputOTPGroup className="gap-2 bg-transparent">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="size-10 rounded-[12px] border border-white/14 bg-black/10 text-sm font-semibold text-white first:rounded-[12px] first:border last:rounded-[12px]"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || otp.length !== 6 || !email}
          className="h-11 rounded-[16px] bg-[#0d8a84] text-sm font-semibold text-white shadow-[0_18px_36px_rgba(13,138,132,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0a6d69]"
        >
          {loading ? copy.submitLoading : copy.submitIdle}
          {!loading ? <ArrowRight className="ml-2 size-4" /> : null}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={resendLoading || !email}
          onClick={handleResend}
          className="h-10 rounded-[15px] border-white/14 bg-white/[0.03] text-sm font-semibold text-white/84 transition hover:bg-white/[0.08]"
        >
          {resendLoading ? copy.resendLoading : copy.resendIdle}
          {!resendLoading ? <RefreshCw className="ml-2 size-4" /> : null}
        </Button>
      </form>
    </AuthCardShell>
  );
}
