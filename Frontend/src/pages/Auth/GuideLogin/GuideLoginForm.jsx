import { Link } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

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

export default function GuideLoginForm({
  content,
  loading,
  showPassword,
  onLogin,
  onTogglePassword,
  email,
  password,
  setEmail,
  setPassword,
}) {
  return (
    <form
      className="flex flex-col gap-3.5 sm:gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onLogin();
      }}
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <FieldShell icon={Mail}>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={content.emailLabel}
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
              onClick={onTogglePassword}
              className="rounded-full text-white/52 hover:bg-transparent hover:text-[#dec19a]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          }
        >
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={content.passwordLabel}
            className="h-12 rounded-[18px] border-white/16 bg-white/[0.03] pl-12 pr-13 text-sm text-white placeholder:text-[#a4b0b1] focus-visible:border-[#d8b98f] focus-visible:ring-[#d8b98f]/15 sm:h-13 sm:text-[0.98rem]"
          />
        </FieldShell>
      </div>

      <div className="-mt-1 flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-semibold text-[#dfc198] transition hover:text-white"
        >
          {content.forgotPassword}
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-auto min-h-12 rounded-[18px] bg-[#0b8c87] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(11,140,135,0.18)] transition hover:bg-[#09726e] sm:min-h-13 sm:text-[1rem]"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4 animate-spin" />
            {content.loadingLabel}
          </span>
        ) : (
          content.submitLabel
        )}
      </Button>

      <div className="mt-2 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-xs leading-6 text-white/70 sm:text-sm">
        <strong className="mb-1 block text-white">{content.notice.title}</strong>
        {content.notice.description}
      </div>
    </form>
  );
}
