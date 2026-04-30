import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const GuideLoginForm = ({
  content,
  loading,
  showPassword,
  onLogin,
  onTogglePassword,
  email,
  password,
  setEmail,
  setPassword,
}) => {
  return (
    <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.06)] ring-outline-variant/10">
      <CardContent className="p-8 md:p-12">
        <header className="mb-10">
          <h1 className="font-headline mb-3 text-3xl font-bold tracking-tight text-on-surface">
            {content.heading}
          </h1>
          <p className="text-base leading-relaxed text-on-surface-variant">
            {content.description}
          </p>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant"
              htmlFor="guide-email"
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
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="guide@voyager.ai"
                className="h-auto rounded-2xl border-0 bg-surface-container-low py-4 pl-12 pr-4 text-on-surface placeholder:text-outline ring-1 ring-outline-variant/20 transition-all duration-200 focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <Label
                className="text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                htmlFor="guide-password"
              >
                Password
              </Label>
              <Button
                asChild
                variant="link"
                className="h-auto p-0 text-xs font-semibold text-primary hover:text-primary-container"
              >
                <Link to="/forgot-password">Forgot password?</Link>
              </Button>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-outline">
                <span className="material-symbols-outlined text-[20px]">
                  lock
                </span>
              </div>
              <Input
                id="guide-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="h-auto rounded-2xl border-0 bg-surface-container-low py-4 pl-12 pr-14 text-on-surface placeholder:text-outline ring-1 ring-outline-variant/20 transition-all duration-200 focus-visible:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-outline hover:bg-transparent hover:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              size="lg"
              disabled={loading}
              onClick={onLogin}
              className="group h-auto w-full rounded-2xl bg-gradient-to-br from-primary to-primary-container py-4 text-base font-bold text-on-primary shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Spinner className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login to Dashboard
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

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
            <strong className="mb-1 block text-on-surface">
              {content.notice.title}
            </strong>
            {content.notice.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuideLoginForm;
