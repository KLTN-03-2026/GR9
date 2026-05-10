import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubmissionWaiting = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-16 text-on-surface">
      <section className="w-full max-w-3xl rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-10 text-center shadow-[0_28px_70px_rgba(25,28,30,0.08)]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-700">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black tracking-normal">
          Hồ sơ đã được gửi
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-on-surface-variant">
          Hồ sơ đối tác của bạn đang chờ admin xét duyệt. Khi được phê duyệt,
          hệ thống sẽ gửi thông tin đăng nhập provider qua email bạn đã đăng ký.
        </p>
        <Button asChild className="mt-8 rounded-full bg-primary px-6 font-bold text-on-primary">
          <Link to="/">Về trang chủ</Link>
        </Button>
      </section>
    </main>
  );
};

export default SubmissionWaiting;
