import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import authBackdrop from "@/assets/redesign/halong-terrace-dusk.png";
import BrandLogo from "@/components/shared/brand-logo";
import LanguageToggle from "@/components/shared/language-toggle";
import { useI18n } from "@/i18n/I18nProvider";

export default function AuthCardShell({
  title,
  description,
  children,
  footer,
  tabs = [],
  image = authBackdrop,
}) {
  const { language } = useI18n();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#081114] text-white">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[22%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,20,0.06)_0%,rgba(8,17,20,0.16)_34%,rgba(8,17,20,0.58)_64%,rgba(8,17,20,0.88)_78%,rgba(8,17,20,0.96)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(248,211,166,0.22),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(0,117,110,0.14),transparent_22%)]" />

      <div className="relative z-10 min-h-screen px-3 py-4 sm:px-6 sm:py-6 lg:px-0">
        <div className="mx-auto grid min-h-screen w-full max-w-[1680px] items-start lg:items-center lg:grid-cols-[6fr_4fr]">
          <div className="hidden min-h-screen lg:block" />

          <div className="flex items-start justify-center px-0 py-3 sm:py-6 lg:items-center lg:px-10 xl:px-14">
            <div className="w-full max-w-[560px]">
              <div className="rounded-[24px] border border-white/14 bg-[linear-gradient(180deg,rgba(13,24,29,0.72)_0%,rgba(9,17,21,0.9)_100%)] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.3)] backdrop-blur-[18px] sm:rounded-[28px] sm:p-7 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/"
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-white/6 px-3 py-2 text-xs font-semibold text-white/82 transition hover:bg-white/10 hover:text-white sm:px-3.5 sm:text-sm"
                    >
                      <ArrowLeft className="size-4" />
                      {language === "vi" ? "Về trang chủ" : "Back home"}
                    </Link>

                    <Link to="/" className="shrink-0">
                      <BrandLogo
                        light
                        variant="editorial"
                        className="gap-2.5 sm:gap-3"
                        iconClassName="size-9 sm:size-11"
                        showTagline={false}
                        subLabel={language === "vi" ? "Việt Nam" : "Vietnam"}
                      />
                    </Link>
                  </div>

                  <LanguageToggle className="self-end !h-9 !rounded-full !border-white/16 !bg-white/6 !px-3 !text-white hover:!bg-white/10 sm:self-auto sm:!h-10 sm:!px-3.5" />
                </div>

                <div className="mt-6 sm:mt-8">
                  <h1 className="max-w-full [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[1.62rem] leading-[1.08] tracking-[-0.04em] text-[#f7ead8] sm:max-w-[360px] sm:text-[2.3rem]">
                    {title}
                  </h1>
                  {description ? (
                    <p className="mt-3 max-w-full text-sm leading-6 text-[#d2c7ba] sm:max-w-[360px] sm:text-[0.98rem] sm:leading-7">
                      {description}
                    </p>
                  ) : null}
                </div>

                {tabs.length ? (
                  <div className="-mx-1 mt-6 flex gap-4 overflow-x-auto border-b border-white/14 px-1 pb-px sm:mt-8 sm:gap-7">
                    {tabs.map((tab) => (
                      <Link
                        key={tab.to}
                        to={tab.to}
                        className={`shrink-0 border-b px-1 pb-3 text-sm font-semibold transition sm:text-[1.02rem] ${
                          tab.active
                            ? "border-[#d7b687] text-[#f5ead9]"
                            : "border-transparent text-[#c6b6a1] hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </Link>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 sm:mt-6">{children}</div>

                {footer ? (
                  <div className="mt-6 text-center text-sm text-[#c6bdb1]">
                    {footer}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
