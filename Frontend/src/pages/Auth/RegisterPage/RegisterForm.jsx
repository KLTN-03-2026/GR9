import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
<<<<<<< HEAD
import { Spinner } from "@/components/ui/spinner";
=======
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
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
const RegisterForm = ({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  handleSignUpUser,
  handleGoogleLogin,
<<<<<<< HEAD
  loadingGoogle,
=======
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
}) => {
  return (
    <>
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

          <Button
            onClick={() => handleGoogleLogin()}
<<<<<<< HEAD
            disabled={loadingGoogle}
            className="h-12 w-full flex items-center justify-center gap-3 bg-surface-container-lowest py-3.5 px-4 rounded-xl editorial-shadow hover:bg-surface-container-low transition-colors duration-200 group"
          >
            {loadingGoogle ? (
              <>
                <div className="text-black flex gap-2">
                  <Spinner className="h-5 w-5 animate-spin " />
                  Đang kết nối...
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
=======
            className="h-12 w-full flex items-center justify-center gap-3 bg-surface-container-lowest py-3.5 px-4 rounded-xl editorial-shadow hover:bg-surface-container-low transition-colors duration-200 group"
          >
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
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
          </Button>

          <div className="flex items-center gap-4 py-1">
            <Separator className="bg-outline-variant/20" />
            <span className="shrink-0 text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              Or Continue With
            </span>
            <Separator className="bg-outline-variant/20" />
          </div>

<<<<<<< HEAD
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              handleSignUpUser();
            }}
          >
=======
          <form className="space-y-6">
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
<<<<<<< HEAD
=======
              onClick={() => handleSignUpUser()}
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
              disabled={loading}
              type="submit"
              size="lg"
              className="h-14 w-full rounded-xl bg-gradient-to-br from-primary to-primary-container text-lg font-bold text-on-primary shadow-[0_18px_35px_rgba(25,28,30,0.08)] transition-transform hover:scale-[1.01] active:scale-[0.98]"
            >
<<<<<<< HEAD
              {loading ? "Sending OTP..." : "Register"}
=======
              {loading ? "Registering..." : "Register"}
>>>>>>> 7ae5aa9f848602989c74bfe555d11299ca3bc5c0
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
    </>
  );
};

export default RegisterForm;
