import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Compass, Home, SearchX } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const getHomePath = (pathname) => {
  if (pathname.startsWith("/traveler")) return "/traveler";
  if (pathname.startsWith("/admin")) return "/admin";
  if (pathname.startsWith("/provider")) return "/provider";
  if (pathname.startsWith("/guide")) return "/guide";
  if (pathname.startsWith("/guest")) return "/guest";
  return "/";
};

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const homePath = getHomePath(location.pathname);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-20 text-on-surface">
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-8 text-center shadow-[0_28px_70px_rgba(25,28,30,0.08)] md:p-12"
      >
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-teal-200/20 blur-3xl" />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <SearchX className="h-9 w-9" />
        </div>

        <p className="relative mt-8 text-sm font-black uppercase tracking-[0.22em] text-primary">
          404 - Page not found
        </p>
        <h1 className="relative mt-4 text-4xl font-black tracking-normal md:text-6xl">
          Trang này không tồn tại
        </h1>
        <p className="relative mx-auto mt-5 max-w-xl text-base leading-7 text-on-surface-variant">
          Đường dẫn bạn vừa mở không khớp với trang nào trong Travel_AI. Có thể
          trang đã được đổi tên, bị xoá hoặc bạn nhập sai URL.
        </p>

        <div className="relative mt-6 rounded-2xl bg-surface-container-low px-4 py-3 text-left">
          <p className="truncate text-sm font-semibold text-on-surface-variant">
            URL: <span className="font-bold text-on-surface">{location.pathname}</span>
          </p>
        </div>

        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-12 rounded-full px-6 font-bold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <Button
            asChild
            className="h-12 rounded-full bg-primary px-6 font-bold text-on-primary hover:bg-teal-700"
          >
            <Link to={homePath}>
              <Home className="mr-2 h-4 w-4" />
              Về trang chính
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="h-12 rounded-full px-6 font-bold"
          >
            <Link to="/traveler/tour-list">
              <Compass className="mr-2 h-4 w-4" />
              Xem tour
            </Link>
          </Button>
        </div>
      </motion.section>
    </main>
  );
}
