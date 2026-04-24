import { useContext, useState } from "react";
import toast from "react-hot-toast";

<<<<<<< HEAD
<<<<<<< HEAD
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
=======
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
>>>>>>> 899ec63ae2a1e700d3cf0655197af36bfc4e1b24
import AuthContext from "@/context/authContext";
import LoginForm from "./LoginForm";

<<<<<<< HEAD
=======
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import AuthContext from "@/context/authContext";
import LoginForm from "./LoginForm";

>>>>>>> bc5fb87e8b9a97824290b0b453bfc98c387007a8
export default function ProviderAndAdminLogin() {
  const [activeRole, setActiveRole] = useState("provider");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleSignIn = async (trimmedEmail, trimmedPassword) => {
    try {
      setLoading(true);
      await loginUser(trimmedEmail, trimmedPassword);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
<<<<<<< HEAD
=======
const roleMeta = {
  provider: {
    label: "Provider",
    description: "Enter your credentials to access the provider portal.",
    icon: "person_check",
  },
  admin: {
    label: "Admin",
    description: "Enter your credentials to access the admin portal.",
    icon: "admin_panel_settings",
  },
};

function LoginForm({
  role,
  email,
  password,
  setEmail,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
}) {
  const currentRole = roleMeta[role];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email and password
    const trimmedEmail = email?.trim() || "";
    const trimmedPassword = password?.trim() || "";

    if (!trimmedEmail) {
      toast.error("Email is required");
      return;
>>>>>>> 899ec63ae2a1e700d3cf0655197af36bfc4e1b24
    }

    if (!trimmedEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!trimmedPassword) {
      toast.error("Password is required");
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
=======
>>>>>>> bc5fb87e8b9a97824290b0b453bfc98c387007a8
    }

    onSubmit(trimmedEmail, trimmedPassword);
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
    <TabsContent value={role} className="mt-0">
      <div className="mb-10">
        <h2 className="mb-2 font-headline text-3xl font-bold text-on-surface">
          Welcome Back
        </h2>
        <p className="text-on-surface-variant">{currentRole.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="ml-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Access Role
          </Label>
          <TabsList className="grid h-auto w-full grid-cols-2 gap-3 rounded-xl bg-transparent p-0">
            {Object.entries(roleMeta).map(([value, item]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-3 text-on-surface-variant data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`email-${role}`}
            className="ml-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            Work Email
          </Label>
          <div className="group relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">
              mail
            </span>
            <Input
              id={`email-${role}`}
              type="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@voyager.ai"
              className="h-14 rounded-xl border-transparent bg-surface-container-low pl-12 pr-4 text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/10"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="ml-1 flex items-center justify-between">
            <Label
              htmlFor={`password-${role}`}
              className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
            >
              Password
            </Label>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-xs font-medium text-primary hover:underline"
            >
              Forgot?
            </Button>
          </div>

          <div className="group relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">
              lock
            </span>
            <Input
              id={`password-${role}`}
              type={showPassword ? "text" : "password"}
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-14 rounded-xl border-transparent bg-surface-container-low pl-12 pr-12 text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/10"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPassword((value) => !value)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:bg-transparent hover:text-primary"
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
        >
          <span>{loading ? "Signing In..." : "Sign In"}</span>
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Button>
      </form>

      <Card className="mt-8 rounded-xl border border-secondary-container/50 bg-secondary-container/30 py-0 shadow-none">
        <CardContent className="flex items-start gap-3 p-4">
          <span className="material-symbols-outlined mt-0.5 text-xl text-on-secondary-container">
            info
          </span>
          <CardDescription className="text-sm leading-snug text-on-secondary-container">
            Contact system administrator for access issues. Your activity is
            monitored for security purposes.
          </CardDescription>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default function ProviderAndAdminLogin() {
  const [activeRole, setActiveRole] = useState("provider");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const handleSignIn = async (trimmedEmail, trimmedPassword) => {
    try {
      setLoading(true);
      await loginUser(trimmedEmail, trimmedPassword);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
>>>>>>> 899ec63ae2a1e700d3cf0655197af36bfc4e1b24
=======
>>>>>>> bc5fb87e8b9a97824290b0b453bfc98c387007a8
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
            <Tabs
              value={activeRole}
              onValueChange={setActiveRole}
              className="w-full"
            >
              <LoginForm
                role="provider"
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                onSubmit={handleSignIn}
              />
              <LoginForm
                role="admin"
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                onSubmit={handleSignIn}
              />
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
