import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

import AuthContext from "@/context/authContext";
import heroImage from "@/assets/redesign/hue-imperial-dusk.png";
import AuthCardShell from "../../../components/AuthShare/AuthCardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset } = useContext(AuthContext);
  const navigate = useNavigate();
  const { language } = useI18n();
  const copy = buildAuthCopy(language).forgotPage;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await requestPasswordReset(email);
      const targetEmail = response?.email || email;
      navigate(`/forgot-password/verify-otp?email=${encodeURIComponent(targetEmail)}`);
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
            to="/login"
            className="ml-1 font-semibold text-[#d9b782] transition hover:text-white"
          >
            {copy.footerLink}
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

        <Button
          type="submit"
          disabled={loading || !email}
          className="h-11 rounded-[16px] bg-[#0d8a84] text-sm font-semibold text-white shadow-[0_18px_36px_rgba(13,138,132,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0a6d69]"
        >
          {loading ? copy.submitLoading : copy.submitIdle}
          {!loading ? <ArrowRight className="ml-2 size-4" /> : null}
        </Button>

        <div className="text-center text-[10px] uppercase tracking-[0.22em] text-white/42">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="size-3.5" />
            {copy.footerBadge}
          </span>
        </div>
      </form>
    </AuthCardShell>
  );
}
