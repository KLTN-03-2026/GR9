import React from "react";
import { UploadCloud } from "lucide-react";

const SubmissionWaiting = () => {
  return (
    <div className="bg-background min-h-screen font-body text-on-surface">
      <main className="pt-16 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-700">
              <UploadCloud className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Đăng ký đã được gửi</h1>
            <p className="text-slate-600 text-base leading-relaxed">
              Hồ sơ của bạn đang chờ admin xét duyệt. Chúng tôi sẽ liên hệ lại
              với bạn qua email ngay khi có kết quả.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionWaiting;
