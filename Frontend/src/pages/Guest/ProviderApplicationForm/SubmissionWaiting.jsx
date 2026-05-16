import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import bayHero from "@/assets/redesign/bay-hero.png";
import BrandLogo from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

const SubmissionWaiting = () => {
  const { t } = useI18n();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071115] px-5 py-16 text-white">
      <img
        src={bayHero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-28"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,17,21,0.9)_0%,rgba(8,24,28,0.82)_48%,rgba(7,17,21,0.94)_100%)]" />

      <section className="relative w-full max-w-3xl rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(12,24,29,0.78)_0%,rgba(8,17,21,0.9)_100%)] p-10 text-center shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
        <div className="flex justify-center">
          <BrandLogo
            light
            variant="editorial"
            className="gap-3"
            iconClassName="size-11"
            showTagline
            subLabel="Vietnam"
          />
        </div>

        <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/14 bg-white/8 text-[#f3d9b0]">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="mt-8 [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-3xl leading-tight tracking-[-0.04em] text-[#f7ead8] md:text-[3.2rem]">
          {t("providerApplication.submittedTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/74">
          {t("providerApplication.submittedDescription")}
        </p>

        <Button
          asChild
          className="mt-8 rounded-full bg-[#0b8c87] px-6 font-bold text-white hover:bg-[#09726e]"
        >
          <Link to="/">{t("guestHeader.backHome")}</Link>
        </Button>
      </section>
    </main>
  );
};

export default SubmissionWaiting;
