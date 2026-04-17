import { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthContext from "@/context/authContext";
import AuthFeaturePanel from "../../../components/AuthShare/AuthFeaturePanel";
import AuthCardShell from "../../../components/AuthShare/AuthCardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FirstJoinPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateFirstJoinPassword } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await updateFirstJoinPassword({ password, confirmPassword });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-stretch">
      <AuthFeaturePanel
        badge="Provider Onboarding"
        title="Bạn cần đổi mật khẩu lần đầu tiên"
        description="Vui lòng đặt mật khẩu mới để hoàn tất thiết lập tài khoản đối tác của bạn."
      />

      <AuthCardShell
        title="Đổi mật khẩu lần đầu"
        description="Nhập mật khẩu mới để tiếp tục sử dụng tài khoản đối tác."
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Email
              </Label>
              <Input
                value={email}
                disabled
                className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest px-4 text-on-surface"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest px-4 pr-14 text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-primary/10"
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
              <Label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                Xác nhận mật khẩu
              </Label>
              <Input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-14 rounded-xl border-outline-variant/20 bg-surface-container-lowest px-4 text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-primary/10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            size="lg"
            className="h-14 w-full rounded-xl bg-gradient-to-br from-primary to-primary-container text-lg font-bold text-on-primary shadow-[0_18px_35px_rgba(25,28,30,0.08)] transition-transform hover:scale-[1.01] active:scale-[0.98]"
          >
            {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </AuthCardShell>
    </main>
  );
}
