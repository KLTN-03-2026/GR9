import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Cloud, FileCheck2, FileUp, ShieldCheck } from "lucide-react";

import PageHero from "@/components/shared/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  approveProviderApplication,
  getActiveProviderPolicy,
  getProviderApplications,
  rejectProviderApplication,
  uploadProviderPolicy,
} from "@/services/api/provider";
import ProviderApprovalCard from "./ProviderApprovalCard";

const ProviderApprovalPage = () => {
  const [providers, setProviders] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [policyTitle, setPolicyTitle] = useState("Chính sách đăng ký đối tác Travel_AI");
  const [policyFile, setPolicyFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [policyUploading, setPolicyUploading] = useState(false);
  const [error, setError] = useState(null);

  const loadProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProviderApplications();
      const data = response?.data?.data;
      setProviders(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Không thể tải danh sách hồ sơ đối tác.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProviderPolicy = async () => {
    try {
      const response = await getActiveProviderPolicy();
      setPolicy(response?.data?.data || null);
    } catch {
      setPolicy(null);
    }
  };

  useEffect(() => {
    loadProviders();
    loadProviderPolicy();
  }, []);

  const handleApprove = async (providerId) => {
    setLoading(true);
    try {
      await approveProviderApplication(providerId);
      toast.success("Đã phê duyệt hồ sơ đối tác.");
      await loadProviders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Phê duyệt thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (providerId) => {
    setLoading(true);
    try {
      await rejectProviderApplication(providerId);
      toast.success("Đã từ chối hồ sơ đối tác.");
      await loadProviders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Từ chối thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePolicyUpload = async () => {
    if (!policyFile) {
      toast.error("Vui lòng chọn file chính sách PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("title", policyTitle);
    formData.append("policyDocument", policyFile);

    setPolicyUploading(true);
    try {
      await uploadProviderPolicy(formData);
      toast.success("Đã cập nhật chính sách provider.");
      setPolicyFile(null);
      await loadProviderPolicy();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể upload chính sách.");
    } finally {
      setPolicyUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-24">
      <PageHero
        eyebrow="Provider Verification"
        heading={
          <>
            Duyệt hồ sơ{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              đối tác
            </span>
          </>
        }
        description="Xem thông tin đăng ký, kiểm tra tài liệu được upload lên Cloudinary và phê duyệt tài khoản provider."
        actions={
          <Card className="w-full min-w-[220px] rounded-3xl border border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="px-5 py-4">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                Hồ sơ chờ duyệt
              </p>
              <p className="font-headline text-3xl font-bold text-slate-900">
                {providers.length}
              </p>
            </CardContent>
          </Card>
        }
      />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          {loading ? (
            <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-10 text-center text-slate-500">
                Đang tải danh sách hồ sơ đối tác...
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="rounded-3xl border border-rose-200 bg-rose-50 shadow-sm">
              <CardContent className="p-10 text-center text-rose-700">
                {error}
              </CardContent>
            </Card>
          ) : providers.length === 0 ? (
            <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-10 text-center text-slate-500">
                Chưa có hồ sơ đăng ký đối tác nào đang chờ duyệt.
              </CardContent>
            </Card>
          ) : (
            providers.map((provider) => (
              <ProviderApprovalCard
                key={provider._id || provider.id}
                provider={provider}
                onApprove={() => handleApprove(provider._id || provider.id)}
                onReject={() => handleReject(provider._id || provider.id)}
              />
            ))
          )}
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Card className="rounded-3xl border-slate-200 bg-white p-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-900">
                Chính sách provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              {policy ? (
                <div className="rounded-2xl bg-teal-50 p-4 text-sm text-teal-900">
                  <p className="font-bold">{policy.title}</p>
                  <p className="mt-1 text-xs text-teal-700">
                    File hiện hành: {policy.originalName || "provider-policy.pdf"}
                  </p>
                  <a
                    href={policy.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-xs font-bold text-teal-700 underline"
                  >
                    Xem chính sách hiện tại
                  </a>
                </div>
              ) : (
                <div className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  Chưa có chính sách hiện hành. User sẽ chưa thể gửi hồ sơ provider.
                </div>
              )}

              <div className="space-y-2">
                <input
                  value={policyTitle}
                  onChange={(event) => setPolicyTitle(event.target.value)}
                  className="h-11 w-full rounded-xl bg-slate-50 px-3 text-sm font-semibold outline-none ring-1 ring-slate-200 focus:ring-teal-500"
                  placeholder="Tên chính sách"
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setPolicyFile(event.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-bold file:text-slate-700 hover:file:bg-teal-50"
                />
              </div>

              <button
                type="button"
                onClick={handlePolicyUpload}
                disabled={policyUploading}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-600 px-4 text-sm font-bold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FileUp className="mr-2 h-4 w-4" />
                {policyUploading ? "Đang upload..." : "Upload chính sách mới"}
              </button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden rounded-3xl border-none bg-teal-900 p-4 text-white shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="relative z-10 text-[11px] font-bold uppercase tracking-[0.15em] opacity-70">
                Review status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-8">
              <div>
                <p className="font-headline text-4xl font-extrabold">
                  {providers.length}
                </p>
                <p className="mt-1 text-sm opacity-75">
                  hồ sơ đang chờ admin kiểm tra
                </p>
                <Progress
                  value={providers.length > 0 ? 70 : 0}
                  className="mt-4 h-1.5 bg-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/5 bg-white/10 p-4">
                  <FileCheck2 className="mb-3 h-5 w-5 text-teal-100" />
                  <p className="text-[10px] font-bold uppercase opacity-60">
                    Review documents
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/10 p-4">
                  <Cloud className="mb-3 h-5 w-5 text-teal-100" />
                  <p className="text-[10px] font-bold uppercase opacity-60">
                    Cloudinary files
                  </p>
                </div>
              </div>
            </CardContent>
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-500/20 blur-[80px]" />
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white p-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-900">
                Quy trình duyệt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6 text-sm leading-relaxed text-slate-500">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-teal-600" />
                <p>Kiểm tra email, số điện thoại và địa chỉ đối tác.</p>
              </div>
              <div className="flex items-start gap-3">
                <FileCheck2 className="mt-0.5 h-4 w-4 text-teal-600" />
                <p>Mở hoặc tải tài liệu từ Cloudinary để xác minh hồ sơ.</p>
              </div>
              <div className="flex items-start gap-3">
                <Cloud className="mt-0.5 h-4 w-4 text-teal-600" />
                <p>Khi phê duyệt, hệ thống tạo tài khoản provider và gửi mật khẩu qua email.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ProviderApprovalPage;
