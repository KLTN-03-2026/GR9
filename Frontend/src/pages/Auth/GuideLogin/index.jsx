import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GuideLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const activeGuideAvatars = [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wu05GWOuObCfupulDQgYOf4E1mtgcre1o5lcmm4X2cuIVO1i7W7j56mFXciXzSDAyzGa2Gv7lZ8RLojUT7EU1g6igKQr2VYjuR90yGwR7vjUVxgaNk_Z7QVOqZCiQZsgXYmlENbfMYvjeKRDAukI4A0DvLErfcY0-MH1X_uzsgaQzjlD2fjpR0vgwdw7fp5HHcab_kuDWFq6Z4om3IF8aoQ1qc08-2cCjXB7XwEkrv1NFDjsF26TQj_Ui7NIjnB15Zz_DTY9TPOl",
      alt: "Professional portrait of a male tour guide smiling in a mountainous outdoor setting",
      fallback: "TG",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQv1LhvoGUdPLTEyvTgR8TalZFxj5yYXydfeXa4ACCCP0oMDVdf441B2hOSNqwdoiqZcu3fJHn0ng5dPhSxJ0zLHi7qlurtg9U0HW0Ha2ZbDd_pcQvmzichLvhzhjBkLoeNK-tVWyxSKCbikAYtasC4TlgytCoGrrvySfr-UVp5gCo7cREiGrMdCUz6nUJ5HP9gfNl82v2n9lDhDN_xDvk5GENqwTafnLIkj_zlFElSGPUxy_wwmfB713iVuaNHzrkrq0P2zbMDWzV",
      alt: "Close-up portrait of a woman with a friendly expression in a sunlit city street",
      fallback: "JW",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhMm0Pl35bAvsvFATdd7hNUvHcU7iRP-1hjHPkVAp9z5yIOqDGPCg-Ha6Ym-_zWNhDci2XjmAYTQcQazbES0V4ZBRLh0yL8FMoRx5-o0F-hWwziNUQMLLchiw-8UttE0WfTfnaI00h_zKtab1MOdbU81H6KrMkJewg1RVdWp__vOT-UNbylQ2UaVyebMf9ZMtUQyg_vuD835q4NFfwdeiEv83FwTVFfRAAsDhCEMyHuY5xoKJc78BQv6taSq9F2gAu-nxl5nowebo",
      alt: "Middle-aged man wearing sunglasses and casual travel attire with a coastal background",
      fallback: "MC",
    },
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface p-4 ">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
        <img
          alt="Dreamy landscape of a tropical coastline with turquoise water and soft morning light hitting the sand"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-overlay"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDelbvdu4j3xysr66byczau-nSmiazQJ3JWP49jyv28wd46EZOGXpHFEcgRtpzTwlHBhUBhFgY1itPHabG5yOriDJVawoWACMCflok6JzClcpU0k8BTb81DHE6Alh6pcwJvVwt7mP3AojSPE2X-gvRN_wUUSyHREVsa-K4y1rQAHM3o3gTJwllIbA-Za583tXGtt032pANESl7Q44wc3SG93hVYsVEqm0ZXG12RLjpR8efZgvWVqhehtoXibMM2JcL8PE9cHsCmWJrh"
        />
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container">
              <span
                className="material-symbols-outlined text-on-primary"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                explore
              </span>
            </div>
            <span className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">
              Voyager AI
            </span>
          </div>
        </div>

        <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.06)] ring-outline-variant/10">
          <CardContent className="p-8 md:p-12">
            <header className="mb-10">
              <h1 className="font-headline mb-3 text-3xl font-bold tracking-tight text-on-surface">
                Guide Staff Login
              </h1>
              <p className="text-base leading-relaxed text-on-surface-variant">
                Access your assigned tours and live tour updates
              </p>
            </header>

            <form
              className="space-y-6"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="space-y-2">
                <Label
                  className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                  htmlFor="email"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-outline">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="guide@voyager-ai.com"
                    className="h-auto rounded-2xl border-0 bg-surface-container-low py-4 pr-4 pl-12 text-on-surface placeholder:text-outline ring-1 ring-outline-variant/20 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-surface-container-lowest"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label
                    className="text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="password"
                  >
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-xs font-semibold text-primary hover:text-primary-container"
                  >
                    Forgot password?
                  </Button>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-outline">
                    <span className="material-symbols-outlined text-[20px]">
                      lock
                    </span>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-auto rounded-2xl border-0 bg-surface-container-low py-4 pr-14 pl-12 text-on-surface placeholder:text-outline ring-1 ring-outline-variant/20 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-surface-container-lowest"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-outline hover:bg-transparent hover:text-primary"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="group h-auto w-full rounded-2xl bg-gradient-to-br from-primary to-primary-container py-4 text-base font-bold text-on-primary shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98]"
                >
                  Login to Dashboard
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Button>
              </div>
            </form>

            <div className="mt-10 flex gap-4 rounded-2xl bg-tertiary-container/10 p-5">
              <div className="pt-1 text-tertiary-container">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  info
                </span>
              </div>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                <strong className="mb-1 block text-on-surface">Notice</strong>
                Guide accounts are managed by your company. Please contact your
                administrator if you cannot access your credentials.
              </p>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-12 flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary"
            >
              Help Center
            </a>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-white/70 py-3 px-5 ring-1 ring-outline-variant/20 backdrop-blur-xl">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">
              Live System Status: Operational
            </span>
          </div>
        </footer>
      </div>

      <div className="fixed top-8 right-8 hidden lg:block">
        <AvatarGroup className="-space-x-3">
          {activeGuideAvatars.map((avatar) => (
            <Avatar
              key={avatar.src}
              size="lg"
              className="ring-4 ring-surface-container-lowest after:border-transparent"
            >
              <AvatarImage alt={avatar.alt} src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount className="size-10 bg-primary-fixed text-[10px] font-bold text-on-primary-fixed-variant ring-4 ring-surface-container-lowest">
            +12k
          </AvatarGroupCount>
        </AvatarGroup>
        <p className="mt-3 text-right text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
          Guides Active Now
        </p>
      </div>
    </main>
  );
};

export default GuideLogin;
