import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  ArrowRight,
  Briefcase,
  MapPin,
  UploadCloud,
} from "lucide-react";
import { applyProvider } from "@/services/api/provider";
import toast from "react-hot-toast";
import InfomationCard from "./InfomationCard";
import SubmissionWaiting from "./SubmissionWaiting";
import UploadFile from "./UploadFile";

const ProviderApplicationForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "OTHER",
    address: "",
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileChange = (file) => {
    setDocumentFile(file);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (documentFile) {
        formData.append("providerDocument", documentFile);
      }
      await applyProvider(formData);
      toast.success("Hồ sơ của bạn đã được gửi. Đang chờ admin xét duyệt.");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <SubmissionWaiting />;
  }

  return (
    <div className="bg-background min-h-screen font-body text-on-surface">
      {/* Main Content Area */}
      <main className="pt-16 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">
            Đăng ký làm đối tác Voyager
          </h1>
          <p className="text-muted-foreground text-lg">
            Tham gia vào hệ sinh thái du lịch cao cấp và bắt đầu hành trình của
            bạn.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1: Thông tin cá nhân/Công ty (Map với fullName, email, phone) */}
            <InfomationCard title="Thông tin cơ bản" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Tên đầy đủ / Tên pháp nhân</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="Skyline Alpine Expeditions"
                    className="bg-slate-50 border-none h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email liên hệ</Label>
                  <Input
                    id="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    type="email"
                    placeholder="contact@domain.com"
                    className="bg-slate-50 border-none h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    type="tel"
                    placeholder="+84 ..."
                    className="bg-slate-50 border-none h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Giới tính (Dành cho người đại diện)
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className="bg-slate-50 border-none h-12">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </InfomationCard>

            {/* Section 2: Địa chỉ */}
            <InfomationCard title="Địa chỉ" icon={Briefcase}>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ trụ sở</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
                  <Input
                    id="address"
                    value={form.address}
                    onChange={handleChange("address")}
                    className="pl-10 bg-slate-50 border-none h-12"
                    placeholder="Số 128 Bạch Đằng, Hải Châu, Đà Nẵng"
                  />
                </div>
              </div>
            </InfomationCard>

            {/* Section 3: Tài liệu & Xác thực */}
            <InfomationCard title="Tài liệu liên quan" icon={UploadCloud}>
              <UploadFile file={documentFile} onFileChange={handleFileChange} />
            </InfomationCard>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6 sticky top-8">
            <div className="bg-slate-900 text-white rounded-3xl p-6 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">Hoàn tất hồ sơ</h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Khi bạn nhấn "Hoàn tất đăng ký", hồ sơ sẽ được gửi tới hệ
                  thống và chuyển sang trang chờ admin xét duyệt. Admin sẽ liên
                  hệ lại với bạn ngay khi có phản hồi.
                </p>
                <div className="mt-6 rounded-3xl bg-slate-800/80 p-4 border border-white/10">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
                    Lưu ý
                  </p>
                  <p className="text-sm text-slate-200">
                    Vui lòng giữ liên lạc bằng email để nhận thông tin tài khoản
                    và mật khẩu từ admin.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            </div>

            <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6">
              <h4 className="font-bold text-teal-900 mb-2">Cần hỗ trợ?</h4>
              <p className="text-sm text-teal-700 mb-4">
                Chúng tôi có đội ngũ hỗ trợ riêng cho đối tác tại Đà Nẵng.
              </p>
              <Button
                variant="outline"
                className="w-full bg-white border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Chat với hỗ trợ viên
              </Button>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-10 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
              >
                {isSubmitting ? "Đang gửi..." : "Hoàn tất đăng ký"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProviderApplicationForm;
