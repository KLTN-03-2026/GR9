import { useContext, useMemo, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import AuthContext from "@/context/authContext";
import heroImage from "@/assets/redesign/hue-imperial-dusk.png";
import AuthCardShell from "../../../components/AuthShare/AuthCardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function FieldShell({ icon: Icon, action, children }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/42">
        <Icon className="size-4" />
      </div>
      {children}
      {action ? (
        <div className="absolute inset-y-0 right-3 flex items-center">{action}</div>
      ) : null}
    </div>
  );
}

export default function FirstJoinPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const role = useMemo(
    () => String(searchParams.get("role") || "PROVIDER").toUpperCase(),
    [searchParams],
  );
  const isGuide = role === "GUIDE";
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateFirstJoinPassword } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await updateFirstJoinPassword({
        currentPassword,
        password,
        confirmPassword,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      title="Đổi mật khẩu lần đầu"
      description={
        isGuide
          ? "Nhập mật khẩu tạm thời từ email và đặt mật khẩu mới để hoàn tất kích hoạt tài khoản guide."
          : "Nhập mật khẩu tạm thời và đặt mật khẩu mới để hoàn tất kích hoạt tài khoản đối tác."
      }
      image={heroImage}
      visualBadge={isGuide ? "Guide onboarding" : "Partner onboarding"}
      visualTitle={isGuide ? "Kích hoạt tài khoản guide" : "Kích hoạt tài khoản đối tác"}
      visualMeta={email}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Email
            </label>
            <FieldShell icon={Mail}>
              <Input
                value={email}
                disabled
                className="h-11 rounded-[15px] rounded-tr-[8px] border-white/10 bg-white/[0.02] pl-11 pr-4 text-sm text-white/54"
              />
            </FieldShell>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Mật khẩu tạm thời
            </label>
            <FieldShell
              icon={LockKeyhole}
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowCurrentPassword((value) => !value)}
                  className="rounded-full text-white/44 hover:bg-transparent hover:text-[#d9b782]"
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              }
            >
              <Input
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 rounded-[15px] rounded-tr-[8px] border-white/12 bg-white/[0.04] pl-11 pr-13 text-sm text-white placeholder:text-white/32 focus-visible:border-[#d9b782] focus-visible:ring-[#d9b782]/12"
              />
            </FieldShell>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Mật khẩu mới
              </label>
              <FieldShell
                icon={LockKeyhole}
                action={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword((value) => !value)}
                    className="rounded-full text-white/44 hover:bg-transparent hover:text-[#d9b782]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                }
              >
                <Input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 rounded-[15px] rounded-tr-[8px] border-white/12 bg-white/[0.04] pl-11 pr-13 text-sm text-white placeholder:text-white/32 focus-visible:border-[#d9b782] focus-visible:ring-[#d9b782]/12"
                />
              </FieldShell>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Xác nhận mật khẩu
              </label>
              <Input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 rounded-[15px] rounded-tr-[8px] border-white/12 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/32 focus-visible:border-[#d9b782] focus-visible:ring-[#d9b782]/12"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !currentPassword || !password || !confirmPassword}
          className="h-11 w-full rounded-[16px] bg-[#0d8a84] text-sm font-semibold text-white shadow-[0_18px_36px_rgba(13,138,132,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0a6d69]"
        >
          {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </Button>
      </form>
    </AuthCardShell>
  );
}
