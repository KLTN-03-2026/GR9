import { Link } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/i18n/I18nProvider";
import { buildAuthCopy } from "@/pages/Auth/auth-copy";

function SocialButton({ loading, onClick, idleLabel, loadingLabel }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="h-auto min-h-13 w-full rounded-[18px] border border-white/16 bg-transparent px-4 py-3 text-white shadow-none transition hover:bg-white/[0.05]"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2 text-[0.98rem] font-semibold">
          <Spinner className="size-4 animate-spin" />
          {loadingLabel}
        </span>
      ) : (
        <span className="inline-flex items-center gap-3 text-[0.98rem] font-semibold">
          <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
              fill="#EA4335"
            />
          </svg>
          {idleLabel}
        </span>
      )}
    </Button>
  );
}

function FieldShell({ icon: Icon, action, children }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/48">
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

export default function LoginForm({
  showPassword,
  setShowPassword,
  loading,
  handleGoogleLogin,
  email,
  setEmail,
  password,
  setPassword,
  handleLoginUser,
  loadingGoogle,
}) {
  const { language } = useI18n();
  const copy = buildAuthCopy(language).loginForm;
  const dividerLabel = language === "vi" ? "HOẶC" : "OR";

  return (
    <form
      className="flex flex-col gap-3.5 sm:gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        handleLoginUser();
      }}
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <FieldShell icon={Mail}>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={copy.emailLabel}
            className="h-12 rounded-[18px] border-white/16 bg-white/[0.03] pl-12 pr-4 text-sm text-white placeholder:text-[#a4b0b1] focus-visible:border-[#d8b98f] focus-visible:ring-[#d8b98f]/15 sm:h-13 sm:text-[0.98rem]"
          />
        </FieldShell>

        <FieldShell
          icon={LockKeyhole}
          action={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPassword((value) => !value)}
              className="rounded-full text-white/52 hover:bg-transparent hover:text-[#dec19a]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          }
        >
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.passwordLabel}
            className="h-12 rounded-[18px] border-white/16 bg-white/[0.03] pl-12 pr-13 text-sm text-white placeholder:text-[#a4b0b1] focus-visible:border-[#d8b98f] focus-visible:ring-[#d8b98f]/15 sm:h-13 sm:text-[0.98rem]"
          />
        </FieldShell>
      </div>

      <div className="-mt-1 flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-[#dfc198] transition hover:text-white"
        >
          {copy.forgotPassword}
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-auto min-h-12 rounded-[18px] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(11,140,135,0.18)] transition hover:bg-[#09726e] sm:min-h-13 sm:text-[1rem] bg-[#0b8c87]"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4 animate-spin" />
            {copy.submitLoading}
          </span>
        ) : (
          copy.submitIdle
        )}
      </Button>

      <div className="flex items-center gap-3 pt-2 text-white/30">
        <div className="h-px flex-1 bg-white/12" />
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/44">
          {dividerLabel}
        </span>
        <div className="h-px flex-1 bg-white/12" />
      </div>

      <SocialButton
        loading={loadingGoogle}
        onClick={handleGoogleLogin}
        idleLabel={copy.googleIdle}
        loadingLabel={copy.googleLoading}
      />

      <p className="text-center text-xs leading-6 text-white/56 sm:text-sm">
        {copy.footerText}
        <Link
          to="/signup"
          className="ml-1 font-semibold text-[#dfc198] transition hover:text-white"
        >
          {copy.footerLink}
        </Link>
      </p>
    </form>
  );
}
