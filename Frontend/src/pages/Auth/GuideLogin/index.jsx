import { useContext, useState } from "react";
import toast from "react-hot-toast";

import AuthContext from "@/context/authContext";

import GuideLoginActiveGuides from "./GuideLoginActiveGuides";
import GuideLoginBrand from "./GuideLoginBrand";
import GuideLoginForm from "./GuideLoginForm";
import GuideLoginFooter from "./GuideLoginFooter";

const guideLoginContent = {
  brand: {
    name: "Voyager AI",
    icon: "explore",
  },
  heading: "Guide Staff Login",
  description: "Access your assigned tours and live tour updates",
  notice: {
    title: "Notice",
    description:
      "Guide accounts are managed by your company. Please contact your administrator if you cannot access your credentials.",
  },
  background: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDelbvdu4j3xysr66byczau-nSmiazQJ3JWP49jyv28wd46EZOGXpHFEcgRtpzTwlHBhUBhFgY1itPHabG5yOriDJVawoWACMCflok6JzClcpU0k8BTb81DHE6Alh6pcwJvVwt7mP3AojSPE2X-gvRN_wUUSyHREVsa-K4y1rQAHM3o3gTJwllIbA-Za583tXGtt032pANESl7Q44wc3SG93hVYsVEqm0ZXG12RLjpR8efZgvWVqhehtoXibMM2JcL8PE9cHsCmWJrh",
    alt: "Dreamy tropical coastline with turquoise water and morning light",
  },
  footerLinks: ["Terms of Service", "Privacy Policy", "Help Center"],
};

const activeGuideAvatars = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wu05GWOuObCfupulDQgYOf4E1mtgcre1o5lcmm4X2cuIVO1i7W7j56mFXciXzSDAyzGa2Gv7lZ8RLojUT7EU1g6igKQr2VYjuR90yGwR7vjUVxgaNk_Z7QVOqZCiQZsgXYmlENbfMYvjeKRDAukI4A0DvLErfcY0-MH1X_uzsgaQzjlD2fjpR0vgwdw7fp5HHcab_kuDWFq6Z4om3IF8aoQ1qc08-2cCjXB7XwEkrv1NFDjsF26TQj_Ui7NIjnB15Zz_DTY9TPOl",
    alt: "Professional portrait of a male tour guide smiling outdoors",
    fallback: "TG",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQv1LhvoGUdPLTEyvTgR8TalZFxj5yYXydfeXa4ACCCP0oMDVdf441B2hOSNqwdoiqZcu3fJHn0ng5dPhSxJ0zLHi7qlurtg9U0HW0Ha2ZbDd_pcQvmzichLvhzhjBkLoeNK-tVWyxSKCbikAYtasC4TlgytCoGrrvySfr-UVp5gCo7cREiGrMdCUz6nUJ5HP9gfNl82v2n9lDhDN_xDvk5GENqwTafnLIkj_zlFElSGPUxy_wwmfB713iVuaNHzrkrq0P2zbMDWzV",
    alt: "Close-up portrait of a woman with a friendly expression",
    fallback: "JW",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhMm0Pl35bAvsvFATdd7hNUvHcU7iRP-1hjHPkVAp9z5yIOqDGPCg-Ha6Ym-_zWNhDci2XjmAYTQcQazbES0V4ZBRLh0yL8FMoRx5-o0F-hWwziNUQMLLchiw-8UttE0WfTfnaI00h_zKtab1MOdbU81H6KrMkJewg1RVdWp__vOT-UNbylQ2UaVyebMf9ZMtUQyg_vuD835q4NFfwdeiEv83FwTVFfRAAsDhCEMyHuY5xoKJc78BQv6taSq9F2gAu-nxl5nowebo",
    alt: "Middle-aged man wearing sunglasses with a coastal background",
    fallback: "MC",
  },
];

const GuideLogin = () => {
  const { loginUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password, "GUIDE");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-[-5%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
        <img
          alt={guideLoginContent.background.alt}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-overlay"
          src={guideLoginContent.background.src}
        />
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        <GuideLoginBrand brand={guideLoginContent.brand} />

        <GuideLoginForm
          content={guideLoginContent}
          loading={loading}
          showPassword={showPassword}
          onLogin={handleLogin}
          onTogglePassword={() => setShowPassword((value) => !value)}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />

        <GuideLoginFooter links={guideLoginContent.footerLinks} />
      </div>

      <GuideLoginActiveGuides avatars={activeGuideAvatars} />
    </main>
  );
};

export default GuideLogin;
