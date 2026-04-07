import { useContext, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/context/authContext";

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
  const [loading, setLoading] = useState(false);
  const { loginGoogle} = useContext(AuthContext);
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
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
                Welcome Back
              </h1>
              <p className="font-medium text-on-surface-variant">
                Access your curated itineraries and travel plans.
              </p>
            </div>

            

            <LoginForm showPassword={showPassword} setShowPassword={setShowPassword} loading={loading} handleGoogleLogin={handleGoogleLogin}/>

            

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
