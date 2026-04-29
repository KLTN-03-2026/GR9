import { useEffect, useState } from "react";
import ProviderApprovalCard from "./ProviderApprovalCard";
import {
  getProviderApplications,
  approveProviderApplication,
  rejectProviderApplication,
} from "@/services/api/provider";

import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHero from "@/components/shared/page-hero";

const ProviderApprovalPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const response = await getProviderApplications();
      const data = response?.data?.data;
      setProviders(Array.isArray(data) ? data : data ? [data] : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Không thể tải danh sách form đăng ký đối tác.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleApprove = async (providerId) => {
    setLoading(true);
    try {
      await approveProviderApplication(providerId);
      toast.success("Đã phê duyệt hồ sơ đối tác.");
      await loadProviders();
    } catch (err) {
      console.error(err);
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
      console.error(err);
      toast.error(err?.response?.data?.message || "Từ chối thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-24">
      <PageHero
        eyebrow="Verification Queue"
        heading={
          <>
            Review New{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              Partnerships
            </span>
          </>
        }
        description="Examine business credentials and verification documents for providers requesting access to the marketplace."
        actions={
          <Card className="w-full min-w-[220px] rounded-3xl border border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="px-5 py-4">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                Total Applications
              </p>
              <p className="text-3xl font-headline font-bold text-slate-900">
                {providers.length}
              </p>
            </CardContent>
          </Card>
        }
      />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-6">
          {loading ? (
            <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-10 text-center text-slate-500">
                Đang tải danh sách form đăng ký...
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
                Chưa có hồ sơ đăng ký đối tác nào.
              </CardContent>
            </Card>
          ) : (
            providers.map((p) => (
              <ProviderApprovalCard
                key={p._id || p.id}
                provider={p}
                onApprove={() => handleApprove(p._id || p.id)}
                onReject={() => handleReject(p._id || p.id)}
              />
            ))
          )}
        </div>

        <div className="xl:col-span-4 space-y-6">
          <Card className="bg-teal-900 border-none text-white relative overflow-hidden rounded-3xl shadow-xl p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-[11px] font-bold tracking-[0.15em] uppercase opacity-60 relative z-10">
                Approval Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              <div>
                <p className="text-4xl font-extrabold font-headline">88%</p>
                <p className="text-sm opacity-70 mt-1">
                  Provider Approval Rate (MTD)
                </p>
                <Progress value={88} className="h-1.5 mt-4 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                  <p className="text-2xl font-bold font-headline">12</p>
                  <p className="text-[10px] opacity-50 font-bold uppercase mt-1">
                    New This Week
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                  <p className="text-2xl font-bold font-headline">4.2d</p>
                  <p className="text-[10px] opacity-50 font-bold uppercase mt-1">
                    Avg. Review Time
                  </p>
                </div>
              </div>
            </CardContent>

            <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          </Card>

          <Card className="bg-white border-slate-200 rounded-3xl shadow-sm p-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Verification Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-500 space-y-4 leading-relaxed pb-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 text-sm">
                  verified
                </span>
                <p>Verify business license validity for current year.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 text-sm">
                  security
                </span>
                <p>Ensure insurance coverage meets $5M minimum.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-600 text-sm">
                  database
                </span>
                <p>Validate Tax ID against official databases.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ProviderApprovalPage;
