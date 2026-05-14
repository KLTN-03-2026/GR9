import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Compass, Home, SearchX } from "lucide-react";

import bayHero from "@/assets/redesign/bay-hero.png";
import BrandLogo from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

const getHomePath = (pathname) => {
  if (pathname.startsWith("/traveler")) return "/traveler";
  if (pathname.startsWith("/admin")) return "/admin";
  if (pathname.startsWith("/provider")) return "/provider";
  if (pathname.startsWith("/guide")) return "/guide";
  if (pathname.startsWith("/guest")) return "/guest";
  return "/";
};

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const homePath = getHomePath(location.pathname);
  const { t } = useI18n();
  const explorePath =
    homePath === "/traveler" ? "/traveler/tour-list" : homePath;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071115] px-5 py-10 text-white sm:px-6 lg:px-8">
      <img
        src={bayHero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-28"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,17,21,0.92)_0%,rgba(8,24,28,0.84)_48%,rgba(7,17,21,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(246,210,165,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(11,140,135,0.18),transparent_24%)]" />

      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(12,24,29,0.78)_0%,rgba(8,17,21,0.9)_100%)] p-8 text-center shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-12"
      >
        <div className="relative flex justify-center">
          <BrandLogo
            light
            variant="editorial"
            className="gap-3"
            iconClassName="size-11"
            showTagline
            subLabel="Vietnam"
          />
        </div>

        <div className="relative mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/14 bg-white/8 text-[#f3d9b0]">
          <SearchX className="h-9 w-9" />
        </div>

        <p className="relative mt-8 text-sm font-black uppercase tracking-[0.24em] text-[#dfc198]">
          {t("notFound.eyebrow")}
        </p>
        <h1 className="relative mx-auto mt-4 max-w-3xl [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-4xl leading-[0.98] tracking-[-0.04em] text-[#f7ead8] md:text-[4.7rem]">
          {t("notFound.title")}
        </h1>
        <p className="relative mx-auto mt-5 max-w-2xl text-base leading-7 text-white/76 md:text-[1.02rem]">
          {t("notFound.description")}
        </p>

        <div className="relative mt-7 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left">
          <p className="truncate text-sm font-semibold text-white/66">
            {t("notFound.urlLabel")}:{" "}
            <span className="font-bold text-white">{location.pathname}</span>
          </p>
        </div>

        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-12 rounded-full border-white/16 bg-transparent px-6 font-bold text-white hover:bg-white/8 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("notFound.back")}
          </Button>

          <Button
            asChild
            className="h-12 rounded-full bg-[#0b8c87] px-6 font-bold text-white shadow-[0_16px_32px_rgba(11,140,135,0.2)] hover:bg-[#09726e]"
          >
            <Link to={homePath}>
              <Home className="mr-2 h-4 w-4" />
              {t("notFound.home")}
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="h-12 rounded-full border border-white/12 bg-white/10 px-6 font-bold text-white hover:bg-white/14"
          >
            <Link to={explorePath}>
              <Compass className="mr-2 h-4 w-4" />
              {t("notFound.browseTours")}
            </Link>
          </Button>
        </div>
      </motion.section>
    </main>
  );
}
