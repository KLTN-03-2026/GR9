import React, { useMemo, useState } from "react";
import CountUpModule from "react-countup";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
} from "lucide-react";

import ChatBotWidget from "@/pages/Traveler/ChatBot/ChatBotWidget";
import { landingChatbotProps } from "@/pages/Traveler/ChatBot/chatbot.data";
import LanguageToggle from "@/components/shared/language-toggle";
import { useI18n } from "@/i18n/I18nProvider";

const CountUp = CountUpModule.default ?? CountUpModule;

const heroImage =
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=85";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const searchItems = [
  {
    title: "Tour du lich",
    description: "Dang nhap de xem danh sach tour va diem den dang mo ban.",
    keywords: ["tour", "du lich", "destination", "diem den"],
    to: "/login",
  },
  {
    title: "Dat tour va thanh toan",
    description: "Xem luong booking, thanh toan va xac nhan chuyen di.",
    keywords: ["booking", "book", "dat tour", "payment", "thanh toan"],
    hash: "workflow",
  },
  {
    title: "Theo doi tour",
    description: "Mo trang tracking cong khai bang ma chia se.",
    keywords: ["tracking", "track", "theo doi", "public tracking"],
    to: "/guest",
  },
  {
    title: "Dang ky tai khoan",
    description: "Tao tai khoan traveler de dat tour va luu lich su chuyen di.",
    keywords: ["signup", "register", "dang ky", "account", "tai khoan"],
    to: "/signup",
  },
  {
    title: "Dang ky doi tac",
    description: "Gui ho so provider de quan ly tour, guide, dich vu va booking.",
    keywords: ["provider", "partner", "doi tac", "apply"],
    to: "/apply-provider",
  },
  {
    title: "Voyager AI",
    description: "Chat thu tro ly AI de hoi ve tour, booking va Travel_AI.",
    keywords: ["ai", "chatbot", "voyager", "tro ly"],
    hash: "assistant",
  },
];

const stats = [
  { end: 4, suffix: "", label: "workspace theo vai tro" },
  { end: 24, suffix: "/7", label: "tro ly Voyager AI" },
  { end: 100, suffix: "%", label: "tracking theo booking" },
  { end: 1, suffix: "", label: "cong thanh toan PayOS" },
];

const normalizeSearch = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function LandingHome() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const localizedFeatures = useMemo(
    () => [
      {
        icon: Sparkles,
        title: t("landing.features.aiTitle"),
        description: t("landing.features.aiDescription"),
      },
      {
        icon: TicketCheck,
        title: t("landing.features.bookingTitle"),
        description: t("landing.features.bookingDescription"),
      },
      {
        icon: MapPinned,
        title: t("landing.features.trackingTitle"),
        description: t("landing.features.trackingDescription"),
      },
      {
        icon: ShieldCheck,
        title: t("landing.features.rolesTitle"),
        description: t("landing.features.rolesDescription"),
      },
    ],
    [t],
  );
  const localizedWorkflow = useMemo(
    () => [
      t("landing.workflow.choose"),
      t("landing.workflow.book"),
      t("landing.workflow.track"),
      t("landing.workflow.review"),
    ],
    [t],
  );

  const suggestions = useMemo(() => {
    const keyword = normalizeSearch(search);
    if (!keyword) return searchItems.slice(0, 5);

    return searchItems
      .map((item) => {
        const title = normalizeSearch(item.title);
        const description = normalizeSearch(item.description);
        const keywords = item.keywords.map(normalizeSearch);
        const score =
          (title.includes(keyword) ? 4 : 0) +
          (keywords.some((candidate) => candidate.includes(keyword) || keyword.includes(candidate)) ? 3 : 0) +
          (description.includes(keyword) ? 1 : 0);

        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [search]);

  const goToSuggestion = (item) => {
    if (!item) return;
    setSearch(item.title);
    setSearchOpen(false);

    if (item.hash) {
      document.getElementById(item.hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    navigate(item.to);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (suggestions[0]) {
      goToSuggestion(suggestions[0]);
      return;
    }
    navigate("/login");
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <ChatBotWidget {...landingChatbotProps} />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/30 bg-white/82 shadow-[0_10px_32px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <MapPinned className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-extrabold tracking-[0.12em] text-on-surface">
              Travel_AI
            </span>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-outline-variant/30 bg-white/70 p-1.5 shadow-sm backdrop-blur-xl lg:flex">
            <motion.button
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ y: 2 }}
              onClick={() => scrollToSection("features")}
              className="group relative rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:text-primary"
            >
              {t("landing.navFeatures")}
              <span className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ y: 2 }}
              onClick={() => scrollToSection("workflow")}
              className="group relative rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:text-primary"
            >
              {t("landing.navWorkflow")}
              <span className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ y: 2 }}
              onClick={() => scrollToSection("assistant")}
              className="group relative rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:text-primary"
            >
              Voyager AI
              <span className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </motion.button>
            <motion.div whileHover={{ y: -3 }} whileTap={{ y: 2 }}>
              <Link
                className="group relative block rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:text-primary"
                to="/apply-provider"
              >
              {t("landing.navPartner")}
                <span className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </motion.div>
          </nav>

          <form onSubmit={handleSearchSubmit} className="relative hidden min-w-[300px] max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={search}
              onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
              onChange={(event) => {
                setSearch(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder={t("landing.searchPlaceholder")}
              className="h-11 w-full rounded-full border border-outline-variant/35 bg-surface-container-low pl-11 pr-4 text-sm font-medium text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary/45 focus:bg-white focus:ring-4 focus:ring-primary/10"
            />

            {searchOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute left-0 right-0 top-[calc(100%+0.6rem)] overflow-hidden rounded-2xl border border-outline-variant/30 bg-white/96 p-2 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-xl"
              >
                {suggestions.length ? (
                  suggestions.map((item) => (
                    <button
                      key={`${item.title}-${item.to || item.hash}`}
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        goToSuggestion(item);
                      }}
                      className="flex w-full flex-col rounded-xl px-4 py-3 text-left transition hover:bg-primary/6"
                    >
                      <span className="text-sm font-bold text-on-surface">{item.title}</span>
                      <span className="mt-0.5 text-xs leading-5 text-on-surface-variant">
                        {item.description}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-4 text-sm font-medium text-on-surface-variant">
                    {t("landing.noSuggestion")}
                  </p>
                )}
              </motion.div>
            ) : null}
          </form>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle />
            <Link
              to="/login"
              className="hidden rounded-full border border-outline-variant/40 bg-white px-4 py-2 text-sm font-bold text-on-surface hover:bg-surface-container-low sm:inline-flex"
            >
              {t("common.login")}
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary-container"
            >
              {t("common.start")}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[740px] overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fb_58%,#eef7f5_100%)] pt-24">
          <img
            src={heroImage}
            alt="Vietnam travel bay"
            className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-28 lg:w-[58%] lg:opacity-90"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.96)_43%,rgba(255,255,255,0.62)_72%,rgba(255,255,255,0.18)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7f9fb] to-transparent" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-3xl"
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-primary"
              >
                <Sparkles className="h-4 w-4" />
                {t("landing.badge")}
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="mt-7 font-heading text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface md:text-7xl"
              >
                {t("landing.heroTitle")}
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">
                {t("landing.heroDescription")}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-4 text-sm font-extrabold text-primary-foreground shadow-[0_18px_50px_rgba(0,104,95,0.18)] hover:bg-primary-container"
                >
                  {t("landing.travelerCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/apply-provider"
                  className="inline-flex items-center justify-center rounded-full border border-outline-variant/40 bg-white/80 px-7 py-4 text-sm font-bold text-on-surface shadow-sm backdrop-blur-xl hover:bg-white"
                >
                  {t("landing.partnerCta")}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl"
            >
              <div className="rounded-[1.5rem] bg-white p-5 shadow-inner shadow-primary/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      {t("landing.liveBoard")}
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold text-on-surface">{t("landing.familyTour")}</h2>
                  </div>
                  <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-black text-on-primary-fixed">
                    {t("landing.confirmed")}
                  </span>
                </div>
                <div className="mt-6 grid gap-3">
                  {[
                    ["Booking", t("landing.paidReady")],
                    ["Guide", t("landing.guideAssigned")],
                    ["Tracking", t("landing.shareLinkEnabled")],
                    ["Review", t("landing.reviewAfterDone")],
                  ].map(([label, value], index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.28 + index * 0.08 }}
                      className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-3"
                    >
                      <span className="text-sm text-on-surface-variant">{label}</span>
                      <span className="text-sm font-bold text-on-surface">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 bg-surface px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="mb-10 max-w-3xl"
            >
              <motion.p variants={fadeUp} className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
                {t("landing.ecosystem")}
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
                {t("landing.featureHeading")}
              </motion.h2>
            </motion.div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
            >
              {localizedFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    variants={fadeUp}
                    whileHover={{ y: -8, scale: 1.015 }}
                    key={item.title}
                    className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.07)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold text-on-surface">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.description}</p>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-24 bg-surface-container-low px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container}>
              <motion.p variants={fadeUp} className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
                {t("landing.navWorkflow")}
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-extrabold tracking-tight text-on-surface">
                {t("landing.workflowHeading")}
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 text-on-surface-variant">
                {t("landing.workflowText")}
              </motion.p>
            </motion.div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-4"
            >
              {localizedWorkflow.map((item, index) => (
                <motion.div
                  variants={fadeUp}
                  whileHover={{ x: 6 }}
                  key={item}
                  className="flex gap-4 rounded-3xl border border-outline-variant/20 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-black text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-on-surface">{item}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {t("landing.roleSync")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="assistant" className="scroll-mt-24 bg-surface px-5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#00685f_0%,#008378_58%,#6bd8cb_100%)] p-8 text-white shadow-[0_24px_80px_rgba(0,104,95,0.20)] md:p-10 lg:grid-cols-[1fr_0.8fr]"
          >
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary-fixed">
                Voyager AI
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight">
                {t("landing.assistantHeading")}
              </h2>
              <p className="mt-4 max-w-2xl text-primary-fixed">
                {t("landing.assistantText")}
              </p>
            </div>
            <div className="grid gap-3">
              {["Goi y tour gia dinh", "Cach theo doi booking", "Dieu kien danh gia tour"].map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  key={item}
                  className="rounded-2xl bg-white/12 px-4 py-4 text-sm font-bold text-white"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="bg-surface px-5 py-20">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -6 }}
                key={stat.label}
                className="rounded-3xl border border-outline-variant/20 bg-white p-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <p className="text-4xl font-black text-primary">
                  <CountUp end={stat.end} duration={2.2} enableScrollSpy scrollSpyOnce />
                  {stat.suffix}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="bg-surface px-5 pb-24 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            className="mx-auto max-w-7xl rounded-[2rem] border border-primary/10 bg-primary-fixed p-8 text-center text-on-primary-fixed shadow-[0_22px_70px_rgba(107,216,203,0.20)] md:p-12"
          >
            <CalendarCheck className="mx-auto h-10 w-10" />
            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-black tracking-tight">
              {t("landing.finalHeading")}
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/signup" className="rounded-full bg-on-primary-fixed px-7 py-4 text-sm font-extrabold text-white">
                {t("landing.travelerCta")}
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-on-primary-fixed/20 px-7 py-4 text-sm font-extrabold"
              >
                {t("common.login")}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-outline-variant/30 bg-white px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between">
          <p className="font-bold text-primary">Travel_AI</p>
          <p>{t("landing.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
