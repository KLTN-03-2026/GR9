import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Link2,
  MapPin,
  Plus,
  SquarePen,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailPageSkeleton } from "@/components/shared/page-skeletons";
import { Card, CardContent } from "@/components/ui/card";
import {
  confirmProviderAiServiceMatch,
  convertProviderAiRequest,
  getProviderAiRequestDetail,
} from "@/services/api/ai";
import { formatCurrencyVND } from "@/utils/formatPrice";
import DialogCreateService from "@/pages/Provider/ServiceManagement/DialogCreateService";
import DialogEditService from "@/pages/Provider/ServiceManagement/DialogEditService";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
};

const formatPrice = (value) => formatCurrencyVND(value);

const formatRemainingTime = (totalSeconds = 0) => {
  const safeSeconds = Math.max(Number(totalSeconds) || 0, 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const totalTravelers = (quantity = {}) =>
  (Number(quantity.ADULT) || 0) + (Number(quantity.CHILD) || 0) + (Number(quantity.INFANT) || 0);

const participantTypeConfig = [
  { key: "ADULT", label: "Người lớn" },
  { key: "CHILD", label: "Trẻ em" },
  { key: "INFANT", label: "Em bé" },
];

const calculateParticipantTourTotal = (quantity = {}, prices = {}) =>
  participantTypeConfig.reduce((sum, { key }) => {
    const count = Number(quantity?.[key]) || 0;
    const unitPrice = Number(prices?.[key]) || 0;
    return sum + count * unitPrice;
  }, 0);

const buildParticipantPriceMap = (totals = []) => {
  const result = { ADULT: 0, CHILD: 0, INFANT: 0 };
  (Array.isArray(totals) ? totals : []).forEach((item) => {
    const type = String(item?.type || "").toUpperCase();
    if (!Object.prototype.hasOwnProperty.call(result, type)) return;
    result[type] = Number(item?.price) || 0;
  });
  return result;
};

const calculateProviderServiceTotal = (requiredServices = [], quantity = {}) =>
  (Array.isArray(requiredServices) ? requiredServices : []).reduce((sum, item) => {
    const activeService = item?.matchedService || null;

    if (!activeService) {
      return sum;
    }

    const prices =
      item?.confirmedMode === "sync_price"
        ? item?.priceComparison?.sourcePrice || buildParticipantPriceMap(item?.source?.total)
        : item?.priceComparison?.matchedPrice || buildParticipantPriceMap(activeService?.total);

    return sum + calculateParticipantTourTotal(quantity, prices);
  }, 0);

const calculateAiSourceServiceTotal = (requiredServices = [], quantity = {}) =>
  (Array.isArray(requiredServices) ? requiredServices : []).reduce((sum, item) => {
    const prices = buildParticipantPriceMap(item?.source?.total);
    return sum + calculateParticipantTourTotal(quantity, prices);
  }, 0);

const getSuggestedPrice = (service = {}, type) =>
  String(service?.total?.find((item) => item.type === type)?.price || "");

const participantLabels = {
  ADULT: "Người lớn",
  CHILD: "Trẻ em",
  INFANT: "Em bé",
};

const PriceSummary = ({ title, prices = {} }) => (
  <div className="rounded-xl bg-white/70 p-3">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
    <div className="mt-2 space-y-1 text-sm text-slate-700">
      {Object.entries(participantLabels).map(([key, label]) => (
        <p key={key}>
          {label}: <span className="font-semibold text-slate-950">{formatPrice(prices?.[key] || 0)}</span>
        </p>
      ))}
    </div>
  </div>
);

const createInitialServiceForm = (item) => ({
  name: item?.source?.name || "",
  type:
    item?.source?.type === "ATTRACTION"
      ? "ACTIVITY"
      : item?.source?.type || item?.normalizedType || "ACTIVITY",
  address: item?.source?.address || "",
  lat: item?.source?.lat ?? "",
  long: item?.source?.long ?? "",
  description: item?.source?.description || "",
  aliases: "",
  status: "ACTIVE",
  priceAdult: getSuggestedPrice(item?.source, "ADULT"),
  priceChild: getSuggestedPrice(item?.source, "CHILD"),
  priceInfant: getSuggestedPrice(item?.source, "INFANT"),
});

function MissingServiceDialog({ item, open, onOpenChange, onCreated }) {
  return (
    <DialogCreateService
      open={open}
      setOpen={onOpenChange}
      initialValues={createInitialServiceForm(item)}
      title="Tạo service còn thiếu"
      description="Provider chưa có service này. Bạn có thể tạo nhanh theo đúng form tạo service chuẩn rồi tiếp tục dựng tour."
      successMessage="Đã tạo service cho AI request"
      onCreated={onCreated}
    />
  );
}

function RequiredServiceCard({ item, onCreate, onConfirm, onEdit, confirmingRole }) {
  const priceAdult = item?.source?.total?.find((entry) => entry.type === "ADULT")?.price || 0;
  const isPriceMismatch = item.matchStatus === "PRICE_MISMATCH" && item.matchedService;

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-950">{item?.source?.name || "Service"}</p>
          <p className="text-xs text-slate-500">{item?.source?.address || item?.normalizedType}</p>
        </div>
        <Badge
          variant={
            item.matchStatus === "PRICE_MISMATCH"
              ? "warning"
              : item.missing
                ? "warning"
                : "success"
          }
        >
          {item.matchStatus === "PRICE_MISMATCH"
            ? "Price mismatch"
            : item.missing
              ? "Missing"
              : "Matched"}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">Vai trò:</span> {item.role}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Loại:</span> {item.normalizedType}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Giá gợi ý người lớn:</span>{" "}
          {formatPrice(priceAdult)}
        </p>
      </div>

      {isPriceMismatch ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Hệ thống nhận ra đây có thể là cùng service, nhưng giá hiện tại của provider khác với giá AI gợi ý.
          </div>

          <div className="rounded-xl border border-slate-200 p-3">
            <p className="font-semibold text-slate-950">{item.matchedService.name}</p>
            <p className="text-xs text-slate-500">{item.matchedService.address || item.matchedService.type}</p>
            <p className="mt-1 text-xs text-slate-500">
              Match {Math.round((item.matchConfidence || 0) * 100)}% - {item.matchReason}
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <PriceSummary title="Giá AI gợi ý" prices={item.priceComparison?.sourcePrice} />
              <PriceSummary title="Giá service hiện có" prices={item.priceComparison?.matchedPrice} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={confirmingRole === item.role}
                onClick={() => onConfirm(item, item.matchedService, "use_existing")}
                className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <Link2 className="size-4" />
                {confirmingRole === item.role ? "Đang lưu..." : "Dùng giá hiện có"}
              </Button>
              <Button
                type="button"
                disabled={confirmingRole === item.role}
                onClick={() => onConfirm(item, item.matchedService, "sync_price")}
                className="rounded-xl bg-teal-600 text-white hover:bg-teal-700"
              >
                <CheckCircle2 className="size-4" />
                {confirmingRole === item.role ? "Đang cập nhật..." : "Đồng bộ giá theo AI"}
              </Button>
            </div>
          </div>
        </div>
      ) : item.matchedService ? (
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              Đã dùng service hiện có: <span className="font-bold">{item.matchedService.name}</span>
              {item.matchReason ? (
                <p className="mt-1 text-xs text-emerald-700">{item.matchReason}</p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => onEdit?.(item.matchedService)}
              className="rounded-xl border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-100"
            >
              <SquarePen className="size-4" />
              Chỉnh sửa service
            </Button>
          </div>
        </div>
      ) : item.candidateServices?.length ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Hệ thống tìm thấy service có thể tương đương. Bạn xác nhận một lần để lưu alias cho những lần sau.
          </div>
          {item.candidateServices.map((candidate) => (
            <div key={candidate._id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{candidate.name}</p>
                  <p className="text-xs text-slate-500">{candidate.address || candidate.type}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Match {Math.round((candidate.matchScore || 0) * 100)}% - {candidate.matchReason}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={confirmingRole === item.role}
                  onClick={() => onConfirm(item, candidate, "use_existing")}
                  className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  <Link2 className="size-4" />
                  {confirmingRole === item.role ? "Đang lưu..." : "Use existing"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => onCreate(item)}
          className="mt-4 rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50"
        >
          <Plus className="size-4" />
          Tạo service này
        </Button>
      )}
    </div>
  );
}

export default function AITourRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [confirmingRole, setConfirmingRole] = useState(null);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [activeMissingService, setActiveMissingService] = useState(null);
  const [editableService, setEditableService] = useState(null);
  const [editServiceOpen, setEditServiceOpen] = useState(false);
  const [nowTick, setNowTick] = useState(Date.now());

  const loadRequest = useCallback(async (options = {}) => {
    const { silent = false } = options;

    try {
      if (!silent) {
        setLoading(true);
      }
      const res = await getProviderAiRequestDetail(id);
      setRequest(res?.data?.data || null);
    } catch (error) {
      console.error("Load AI request error:", error);
      toast.error(error?.response?.data?.message || "Không thể tải AI tour request.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleCreateTour = async () => {
    try {
      setConverting(true);
      const res = await convertProviderAiRequest(id);
      const tourId = res?.data?.data?.tour?._id;
      toast.success("Đã tạo tour đề xuất cho traveler");
      const prefillDate = request?.startDay
        ? `?prefillDate=${encodeURIComponent(request.startDay)}&autoOpen=1`
        : "";
      navigate(tourId ? `/provider/tours/${tourId}/schedule${prefillDate}` : "/provider/manage-tours");
    } catch (error) {
      console.error("Convert AI request error:", error);
      toast.error(error?.response?.data?.message || "Không thể tạo tour từ AI request.");
      await loadRequest();
    } finally {
      setConverting(false);
    }
  };

  const handleConfirmServiceMatch = async (item, candidate, mode = "use_existing") => {
    try {
      setConfirmingRole(item.role);
      const response = await confirmProviderAiServiceMatch(id, {
        role: item.role,
        serviceId: candidate._id,
        mode,
      });
      setRequest((prev) =>
        prev
          ? {
              ...prev,
              requiredServices: response.data.data?.requiredServices || prev.requiredServices,
              missingServices: response.data.data?.missingServices || prev.missingServices,
              possibleServices: response.data.data?.possibleServices || prev.possibleServices,
            }
          : prev,
      );
      toast.success(
        mode === "sync_price"
          ? "Đã đồng bộ giá service theo AI request."
          : "Đã lưu service tương đương. Lần sau hệ thống sẽ tự nhận ra.",
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể xác nhận service tương đương");
    } finally {
      setConfirmingRole(null);
      await loadRequest();
    }
  };

  const missingCount = request?.missingServices?.length || 0;
  const confirmationCount = request?.possibleServices?.length || 0;
  const claimRemainingSeconds = request?.claimExpiresAt
    ? Math.max(Math.floor((new Date(request.claimExpiresAt).getTime() - nowTick) / 1000), 0)
    : 0;
  const publishRemainingSeconds = request?.publishedExpiresAt
    ? Math.max(Math.floor((new Date(request.publishedExpiresAt).getTime() - nowTick) / 1000), 0)
    : 0;
  const canConvert =
    request?.status === "CLAIMED" &&
    claimRemainingSeconds > 0 &&
    missingCount === 0 &&
    confirmationCount === 0;
  const estimatedTourTotal = useMemo(
    () => calculateParticipantTourTotal(request?.quantity, request?.price),
    [request?.price, request?.quantity],
  );
  const aiSourceServiceTotal = useMemo(
    () => calculateAiSourceServiceTotal(request?.requiredServices, request?.quantity),
    [request?.quantity, request?.requiredServices],
  );
  const providerServiceTotal = useMemo(
    () => calculateProviderServiceTotal(request?.requiredServices, request?.quantity),
    [request?.quantity, request?.requiredServices],
  );
  const showResolvedProviderTotal = useMemo(
    () =>
      Array.isArray(request?.requiredServices) &&
      request.requiredServices.some((item) => item?.matchedService),
    [request?.requiredServices],
  );
  const travelerProposalStatus = request?.convertedTourId?.travelerApprovalStatus || null;

  const proposalStatusLabel = useMemo(() => {
    if (travelerProposalStatus === "APPROVED") return "Traveler đã đồng ý";
    if (travelerProposalStatus === "REJECTED") return "Traveler đã từ chối";
    if (travelerProposalStatus === "PENDING") return "Đang chờ traveler xác nhận";
    return null;
  }, [travelerProposalStatus]);

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (!request) {
    return <div className="p-8 text-sm text-slate-500">AI request not found.</div>;
  }

  return (
    <div className="space-y-6 text-on-surface">
      <MissingServiceDialog
        item={activeMissingService}
        open={serviceDialogOpen}
        onOpenChange={(open) => {
          setServiceDialogOpen(open);
          if (!open) {
            setActiveMissingService(null);
          }
        }}
        onCreated={(createdService) => {
          setEditableService(createdService || null);
          setEditServiceOpen(true);
          loadRequest({ silent: true });
        }}
      />
      <DialogEditService
        open={editServiceOpen}
        setOpen={(open) => {
          setEditServiceOpen(open);
          if (!open) {
            setEditableService(null);
          }
        }}
        service={editableService}
        onUpdated={() => {
          loadRequest({ silent: true });
          setEditableService(null);
        }}
      />

      <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-3 h-auto px-0 text-slate-500"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Traveler AI Request</p>
              <h1 className="text-2xl font-extrabold text-slate-950">{request.location || "AI generated tour"}</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {request.status === "CLAIMED" && claimRemainingSeconds > 0 ? (
            <Badge variant="warning" className="px-3 py-2 text-sm">
              Giữ request: {formatRemainingTime(claimRemainingSeconds)}
            </Badge>
          ) : null}
          {request.status === "PUBLISHED" && publishRemainingSeconds > 0 ? (
            <Badge className="bg-slate-100 px-3 py-2 text-sm text-slate-700">
              Còn hiển thị: {formatRemainingTime(Math.min(publishRemainingSeconds, 24 * 60 * 60))}
            </Badge>
          ) : null}
          {request.convertedTourId?._id ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/provider/tours/${request.convertedTourId._id}/schedule`)}
              className="rounded-2xl px-5 font-semibold"
            >
              Xem tour đã tạo
            </Button>
          ) : null}

          <Button
            type="button"
            onClick={handleCreateTour}
            disabled={!canConvert || converting}
            className="rounded-2xl px-6 font-bold"
          >
            <CheckCircle2 className="size-4" />
            {converting
              ? "Creating..."
              : request.status === "PROPOSED"
                ? "Đã gửi chờ traveler duyệt"
                : request.status === "CLAIMED" && claimRemainingSeconds === 0
                  ? "Hết thời gian giữ request"
                : canConvert
                  ? "Create Tour Proposal"
                  : "Hoàn thiện service trước"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-primary/10 text-primary">{request.status}</Badge>
              <Badge className="bg-slate-100 text-slate-700">{request.type}</Badge>
              <Badge className="bg-slate-100 text-slate-700">{request.numberOfDay} days</Badge>
              {proposalStatusLabel ? (
                <Badge variant={travelerProposalStatus === "APPROVED" ? "success" : "warning"}>
                  {proposalStatusLabel}
                </Badge>
              ) : null}
            </div>
            <p className="text-sm leading-7 text-slate-600">{request.description}</p>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <CalendarDays className="mb-2 size-4 text-primary" />
                <p className="text-xs text-slate-500">Start date</p>
                <p className="font-bold">{formatDate(request.startDay)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <Users className="mb-2 size-4 text-primary" />
                <p className="text-xs text-slate-500">Travelers</p>
                <p className="font-bold">{totalTravelers(request.quantity)} people</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <MapPin className="mb-2 size-4 text-primary" />
                <p className="text-xs text-slate-500">Điểm đi</p>
                <p className="font-bold">{request.origin || "-"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <MapPin className="mb-2 size-4 text-primary" />
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-bold">{request.location}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <Sparkles className="mb-2 size-4 text-primary" />
                <p className="text-xs text-slate-500">Budget mục tiêu</p>
                <p className="font-bold">{formatPrice(request.budget || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-extrabold">Traveler</h2>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-bold">{request.travelerId?.fullName || "Traveler"}</p>
              <p className="text-sm text-slate-500">{request.travelerId?.email || "-"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Giá tour AI mục tiêu</p>
              <p className="mt-2 text-sm">Adult: {formatPrice(request.price?.ADULT || 0)}</p>
              <p className="text-sm">Child: {formatPrice(request.price?.CHILD || 0)}</p>
              <p className="text-sm">Infant: {formatPrice(request.price?.INFANT || 0)}</p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Tổng giá dịch vụ AI</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">{formatPrice(aiSourceServiceTotal)}</p>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                {participantTypeConfig.map(({ key, label }) => {
                  const count = Number(request?.quantity?.[key]) || 0;
                  const unitPrice = (request?.requiredServices || []).reduce((sum, item) => {
                    const sourcePrices = buildParticipantPriceMap(item?.source?.total);
                    return sum + (Number(sourcePrices?.[key]) || 0);
                  }, 0);
                  const subtotal = count * unitPrice;
                  return (
                    <p key={key}>
                      {label}: <span className="font-semibold text-slate-900">{count}</span> x{" "}
                      <span className="font-semibold text-slate-900">{formatPrice(unitPrice)}</span>
                      {" = "}
                      <span className="font-semibold text-slate-950">{formatPrice(subtotal)}</span>
                    </p>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Đây là tổng cộng từ toàn bộ service AI đề xuất. So với số bên dưới sẽ dễ đối chiếu hơn so với giá tour AI mục tiêu.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tổng giá tour AI mục tiêu</p>
              <p className="mt-2 text-lg font-bold text-slate-950">{formatPrice(estimatedTourTotal)}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                {missingCount > 0 || confirmationCount > 0
                  ? "Tổng giá service provider (tạm tính)"
                  : "Tổng giá service provider"}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {showResolvedProviderTotal ? formatPrice(providerServiceTotal) : "Chưa đủ dữ liệu"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {missingCount > 0 || confirmationCount > 0
                  ? "Tổng này chỉ tính trên các service đã match/xác nhận thật sự. Các candidate chưa chốt và service còn thiếu sẽ không được cộng vào để tránh làm lệch số."
                  : "Tổng này được cộng từ toàn bộ service thực tế mà provider sẽ dùng để dựng tour."}
              </p>
            </div>
            {missingCount > 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <div className="flex items-start gap-3">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  <p>
                    Provider còn thiếu <span className="font-bold">{missingCount} service</span>. Tạo đủ service thì mới
                    dựng được tour gửi ngược lại cho traveler.
                  </p>
                </div>
              </div>
            ) : confirmationCount > 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <div className="flex items-start gap-3">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  <p>
                    Còn <span className="font-bold">{confirmationCount} service</span> cần xác nhận do lệch giá hoặc chưa
                    đủ chắc chắn. Xử lý xong thì mới tạo tour đề xuất được.
                  </p>
                </div>
              </div>
            ) : request.status === "CLAIMED" && claimRemainingSeconds > 0 ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                Bạn đang giữ request này trong {formatRemainingTime(claimRemainingSeconds)} để setup tour. Nếu hết giờ mà
                chưa tạo xong, request sẽ quay lại danh sách thông báo chung của provider.
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Tất cả service cần thiết đã sẵn sàng. Bạn có thể tạo tour đề xuất ngay.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold">Required Services</h2>
            <p className="text-sm text-slate-500">
              Dữ liệu này bám theo service traveler gửi qua AI request. Thiếu service nào thì tạo ngay ở đây.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {(request.requiredServices || []).map((item) => (
              <RequiredServiceCard
                key={`${item.role}-${item.source?.name}`}
                item={item}
                confirmingRole={confirmingRole}
                onCreate={(currentItem) => {
                  setActiveMissingService(currentItem);
                  setServiceDialogOpen(true);
                }}
                onEdit={(service) => {
                  setEditableService(service);
                  setEditServiceOpen(true);
                }}
                onConfirm={handleConfirmServiceMatch}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-extrabold">Itinerary</h2>
          {(request.itineraries || []).map((day) => (
            <div key={day.dayNumber} className="rounded-2xl border border-slate-200 p-5">
              <p className="font-bold">Day {day.dayNumber}</p>
              <p className="mt-1 text-sm text-slate-500">{day.description}</p>
              <div className="mt-4 space-y-3">
                {(day.activities || []).map((activity, index) => (
                  <div key={`${day.dayNumber}-${index}`} className="flex gap-4 rounded-xl bg-slate-50 p-3">
                    <span className="w-14 text-xs font-bold text-primary">{activity.time}</span>
                    <div>
                      <p className="font-semibold">{activity.serviceId?.name || "Activity"}</p>
                      <p className="text-xs text-slate-500">{activity.serviceId?.address || activity.serviceId?.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
