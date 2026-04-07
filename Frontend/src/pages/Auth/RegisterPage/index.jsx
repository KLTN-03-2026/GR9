import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const showcaseTravelers = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-pK7TwjZdOALP_sr6Up2N28Ups_7DOjaYdeLQAj7nnIivD8gAT0wRyagFljtYvf4OCCh2zQKydtZHe_n1FpiWv0SRe7Kw3xMrZKoR1x_XJvZQceJwzHnOC3PjYmz0WiScpvxhaF1dEsfM-vuRmu-PhCCqFnRw8fmHzAZV_fdbjOVlv81NXVEV25IY4VD764_DiUWd7DfcxGIK5oGI9YnRarFQM-k5e7LN1BepxC4Eo53aCIJ-4avuze9pZeMsK-6despIBUEXIAZA",
    alt: "Traveler portrait one",
    fallback: "AL",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHI9g5rtInLy6WXRHpsVmcbPzNOpTSOU7njCJ6bO9q3iECnoA_B0ChI2qlSgalpsXK_i3krsJr1J56eVwQ_7Ysqtj7vvsM7gtYcM1mexte0udQFrBoOp-15qBt5XJE6748frh9pORbaalcmXAUA4TD9LKnYSZWvkWL1gu1IC8AoVF-31FCD7gFSsWO_FXW_wwlE2nQB9P8dBPanIPv4YsOWZvRf519m1RHr4craUcpUUAWrGexOJSH8jczsDb94Vr_a4oOUOs1wvr8",
    alt: "Traveler portrait two",
    fallback: "MN",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWM8PpUfhwnbNNn_9RW7DtMzAvdiLmrXZdBmiPVo-DnuJCy-sXCO6hV1nz8FibtV7myXaqicxpxQwX9dwwGoCZ3mDA6Sn-g0jyP8CeeaT1Wua-FRxI4sgTMleDtOFiTrPksXfUxW_iKEpPKG7AfY40wEJg_8zF4_XuBUatF6LItrSd6p19jwH2Vgm8pwQDO7C4mAnTlGeAhZ950GwAm9p3r2n0a4aq_3WgF8CNfyual0SQP7FNoelzQG5sZa-ganR77LenTvvHcB5W",
    alt: "Traveler portrait three",
    fallback: "KT",
  },
];

function BrandMark({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
        <span className="material-symbols-outlined text-on-primary">
          travel_explore
        </span>
      </div>
      <span
        className={`font-headline text-2xl font-bold tracking-tight ${light ? "text-white drop-shadow-md" : "text-on-surface"}`}
      >
        Voyager AI
      </span>
    </div>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-stretch">
      <section className="relative hidden overflow-hidden bg-surface-container-highest lg:flex lg:w-1/2">
        <div className="absolute inset-0 z-0">
          <img
            alt="Dragon Bridge Da Nang"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtBTbHBUUC4tiwFPAbIKve74KQOUMhNuErKG59YP2iZ78DvuYKyXqthjEqOokhmWLwDMkMU1E8wUSQ3JEul8A1qBScZiu3yMiJBEc196-7PdDH_CtKM0X4A24cyBweoml0Ybk0sQ824QYDrDkqUcl8I_5x-NWdc0sjtef46tZnSts_1D2o0avr1CtpDpiOldeRQ6W2-tbXJXvsZXy5GKow0Nq8SpdlpFnU0RS1lkreyOg3zacyX4ismJVD4522aQCCN9CFNeTWiFv9"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/15 to-slate-950/45" />
        </div>

        <div className="absolute left-12 top-12 z-10">
          <BrandMark light />
        </div>

        <div className="absolute bottom-12 left-12 right-12 z-10">
          <Card className="rounded-[2rem] border-none bg-surface/70 py-0 shadow-[0_25px_60px_rgba(15,23,42,0.22)] ring-0 backdrop-blur-xl">
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-full bg-tertiary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-on-tertiary-fixed">
                  Editorial Pick
                </span>

                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className="material-symbols-outlined text-sm text-primary"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-headline text-3xl font-extrabold leading-tight text-on-surface">
                  Behold the Dragon of Da Nang.
                </h2>
                <p className="max-w-md text-base leading-relaxed text-on-surface-variant">
                  The Digital Concierge has curated a 48-hour masterpiece in
                  central Vietnam. Your journey begins here.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <AvatarGroup className="-space-x-3">
                  {showcaseTravelers.map((traveler) => (
                    <Avatar
                      key={traveler.src}
                      size="lg"
                      className="ring-2 ring-surface-container-lowest after:border-transparent"
                    >
                      <AvatarImage src={traveler.src} alt={traveler.alt} />
                      <AvatarFallback>{traveler.fallback}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>

                <span className="text-xs font-semibold text-on-surface-variant">
                  +12.4k explorers booked recently
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-surface p-8 lg:w-1/2">
        <Card className="w-full max-w-md border-none bg-transparent py-0 shadow-none ring-0">
          <CardContent className="space-y-8 p-0">
            <div className="mb-8 flex justify-center lg:hidden">
              <BrandMark />
            </div>

            <div className="space-y-2 text-left">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
                Create Your Account
              </h1>
              <p className="font-medium text-on-surface-variant">
                Start saving itineraries and personalized Da Nang travel plans.
              </p>
            </div>

            <Button className="h-12 w-full flex items-center justify-center gap-3 bg-surface-container-lowest py-3.5 px-4 rounded-xl editorial-shadow hover:bg-surface-container-low transition-colors duration-200 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.18-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span className="text-sm font-semibold text-on-surface-variant group-hover:text-on-surface">
                Google
              </span>
            </Button>

            <div className="flex items-center gap-4 py-1">
              <Separator className="bg-outline-variant/20" />
              <span className="shrink-0 text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                Or Continue With
              </span>
              <Separator className="bg-outline-variant/20" />
            </div>

            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    FULL NAME
                  </Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                      person
                    </span>
                    <Input
                      placeholder="TRAN LE DUC TINH"
                      className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-primary/10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                      mail
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex@example.com"
                      className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-primary/10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant"
                    >
                      Password
                    </Label>
                  </div>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                      lock
                    </span>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest pl-12 pr-14 text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-primary/10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-on-surface-variant hover:bg-transparent hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant"
                    >
                      Confirm Password
                    </Label>
                  </div>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                      verified_user
                    </span>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest pl-12 pr-14 text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-primary/10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-on-surface-variant hover:bg-transparent hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="remember"
                  defaultChecked
                  className="size-5 rounded-md border-outline-variant/40 bg-surface-container-lowest"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium text-on-surface-variant"
                >
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-14 w-full rounded-xl bg-gradient-to-br from-primary to-primary-container text-lg font-bold text-on-primary shadow-[0_18px_35px_rgba(25,28,30,0.08)] transition-transform hover:scale-[1.01] active:scale-[0.98]"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm font-medium text-on-surface-variant">
              Already have an account?
              <Button
                asChild
                variant="link"
                className="ml-1 h-auto p-0 font-bold text-primary underline-offset-4 hover:underline"
              >
                <Link to="/login">login</Link>
              </Button>
            </p>

            <div className="flex flex-col gap-4 border-t border-outline-variant/10 pt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant/50 sm:flex-row sm:items-center sm:justify-between">
              <span>&copy; 2024 Voyager AI</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="link"
                  className="h-auto p-0 text-[10px] font-bold uppercase tracking-[0.24em] text-inherit"
                >
                  Privacy
                </Button>
                <Button
                  variant="link"
                  className="h-auto p-0 text-[10px] font-bold uppercase tracking-[0.24em] text-inherit"
                >
                  Terms
                </Button>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">
                    shield
                  </span>
                  <span>Secure SSL</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
