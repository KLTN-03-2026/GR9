import { useContext, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import AuthContext from "@/context/authContext";
import heroImage from "@/assets/redesign/sapa-mist-terraces-v2.png";
import AuthCardShell from "../../../components/AuthShare/AuthCardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/I18nProvider";
import { buildAuthCopy } from "@/pages/Auth/auth-copy";

function FieldShell({ icon: Icon, action, children }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/42">
        <Icon className="size-4" />
      </div>
      {children}
      {action ? (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const otp = useMemo(() => searchParams.get("otp") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPasswordWithOtp } = useContext(AuthContext);
  const { language } = useI18n();
  const copy = buildAuthCopy(language).resetPage;
  const passwordChecks = copy.passwordChecks.map((label, index) => ({
    label,
    pass:
      index === 0
        ? password.length >= 8
        : index === 1
          ? /[A-Z]/.test(password) && /[a-z]/.test(password)
          : /[\d\W_]/.test(password),
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await resetPasswordWithOtp({
        email,
        otp,
        password,
        confirmPassword,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
            to="/forgot-password"
            className="ml-1 font-semibold text-[#d9b782] transition hover:text-white"
          >
            {copy.footerLink}
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              {copy.emailLabel}
            </label>
            <FieldShell icon={Mail}>
              <Input
                value={email}
                readOnly
                disabled
                className="h-11 rounded-[15px] rounded-tr-[8px] border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white/54"
              />
            </FieldShell>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              {copy.passwordLabel}
            </label>
            <FieldShell
              icon={LockKeyhole}
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-full text-white/44 hover:bg-transparent hover:text-[#d9b782]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              }
            >
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder={copy.passwordPlaceholder}
                className="h-11 rounded-[15px] rounded-tr-[8px] border-white/12 bg-white/[0.04] pl-11 pr-13 text-sm text-white placeholder:text-white/32 focus-visible:border-[#d9b782] focus-visible:ring-[#d9b782]/12"
              />
            </FieldShell>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              {copy.confirmPasswordLabel}
            </label>
            <FieldShell
              icon={LockKeyhole}
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-full text-white/44 hover:bg-transparent hover:text-[#d9b782]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              }
            >
              <Input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder={copy.confirmPasswordPlaceholder}
                className="h-11 rounded-[15px] rounded-tr-[8px] border-white/12 bg-white/[0.04] pl-11 pr-13 text-sm text-white placeholder:text-white/32 focus-visible:border-[#d9b782] focus-visible:ring-[#d9b782]/12"
              />
            </FieldShell>
          </div>
        </div>

        <div className="grid gap-2 rounded-[18px] border border-white/10 bg-white/[0.03] p-3 text-sm text-white/62 sm:grid-cols-3">
          {passwordChecks.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div
                className={`flex size-5 items-center justify-center rounded-full ${
                  item.pass ? "bg-[#0d8a84] text-white" : "bg-white/10 text-white/40"
                }`}
              >
                <Check className="size-3.5" />
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !otp || !password || !confirmPassword}
          className="h-11 rounded-[16px] bg-[#0d8a84] text-sm font-semibold text-white shadow-[0_18px_36px_rgba(13,138,132,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0a6d69]"
        >
          {loading ? copy.submitLoading : copy.submitIdle}
          {!loading ? <ArrowRight className="ml-2 size-4" /> : null}
        </Button>
      </form>
    </AuthCardShell>
  );
}
