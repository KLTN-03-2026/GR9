import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
}) {
  const handleSubmit = () => {

    // Validate email and password
    const trimmedEmail = email?.trim() || "";
    const trimmedPassword = password?.trim() || "";

    if (!trimmedEmail) {
      toast.error("Email is required");
      return;
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
    }

    onSubmit(trimmedEmail, trimmedPassword);
  };

  return (
    <div>
      <div className="mb-10">
        <h2 className="mb-2 font-headline text-3xl font-bold text-on-surface">
          Welcome Back
        </h2>
        <p className="text-on-surface-variant">
          Enter your credentials to access your portal.
        </p>
      </div>

      <div  className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="ml-1 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            Work Email
          </Label>
          <div className="group relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary">
              mail
            </span>
            <Input
              id="email"
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
              htmlFor="password"
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
              id="password"
              type={showPassword ? "text" : "password"}
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-14 rounded-xl border-transparent bg-surface-container-low pl-12 pr-14 text-on-surface placeholder:text-outline-variant focus-visible:border-primary focus-visible:ring-primary/10"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setShowPassword((value) => !value)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full text-on-surface-variant hover:bg-transparent hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </Button>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="h-14 w-full rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
        >
          <span>{loading ? "Signing In..." : "Sign In"}</span>
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Button>
      </div>

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
    </div>
  );
}
