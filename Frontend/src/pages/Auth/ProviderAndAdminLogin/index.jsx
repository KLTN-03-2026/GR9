import { useContext, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import AuthContext from "@/context/authContext";
import LoginForm from "./LoginForm";
import { useLocation } from "react-router-dom";

export default function ProviderAndAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const location = useLocation();
  const handleSignIn = async (trimmedEmail, trimmedPassword) => {
    try {
      const role = location.pathname === "/admin-login" ? "ADMIN" : "PROVIDER";
      setLoading(true);
      await loginUser(trimmedEmail, trimmedPassword, role);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="relative flex flex-grow items-center justify-center overflow-hidden px-4 py-12 min-h-screen">
        <div className="absolute right-[-5%] top-[-10%] h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] h-80 w-80 rounded-full bg-secondary-container/20 blur-3xl" />

        <Card className="w-full max-w-5xl overflow-hidden rounded-xl border-none bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.06)] md:flex md:flex-row">
          <div className="relative hidden overflow-hidden bg-primary p-12 md:flex md:w-1/2 md:flex-col md:justify-between">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNKtgvvBIAUDrDTbgKg3Tt2sGnYPUbWKwSUA8OIAOsA4Hr9PNXEbGhd1QB4neKwE1cOaSIwh0vwLiuvU5lZPb7oidDTBg6YeUw4tltB5w9YgInnbt7Ji2DjcGKrqgtdXA70meLIvGOth0WnEHQDgdyWrJaM3J2fsdAJprXwZSlrL8sSOB-ffmsLP1AHh9FR_wGWgwoxC6Rc8BwQZYNaW_2LpYGVsG5lJhR37B74sL7SpPueCUqWmteY86IsJ3FRmB6wyqrk5n4--Mi")',
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container/80" />

            <div className="relative z-10">
              <Card className="mb-8 inline-flex border border-white/20 bg-white/10 py-0 backdrop-blur-md shadow-none">
                <CardContent className="px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white">
                    Partner Portal
                  </span>
                </CardContent>
              </Card>

              <h1 className="mb-4 font-headline text-4xl font-extrabold leading-tight tracking-tight text-white">
                Manage world-class <br />
                travel experiences.
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-white/80">
                Access your professional dashboard to coordinate itineraries,
                manage bookings, and leverage AI-driven insights for your
                clients.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <span className="material-symbols-outlined text-sm text-white">
                  shield_person
                </span>
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/60">
                Enterprise Grade Security
              </span>
            </div>
          </div>

          <CardContent className="w-full p-8 md:w-1/2 md:p-16">
            <LoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              onSubmit={handleSignIn}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
