import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  MapPin,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailPageSkeleton } from "@/components/shared/page-skeletons";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertProviderAiRequest, getProviderAiRequestDetail } from "@/services/api/ai";
import { createService } from "@/services/api/service";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
};

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const totalTravelers = (quantity = {}) =>
  (Number(quantity.ADULT) || 0) + (Number(quantity.CHILD) || 0) + (Number(quantity.INFANT) || 0);

const getSuggestedPrice = (service = {}, type) =>
  String(service?.total?.find((item) => item.type === type)?.price || "");

const serviceTypeOptions = [
  { value: "HOTEL", label: "Accommodation" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "ACTIVITY", label: "Activity" },
  { value: "FOOD", label: "Food" },
  { value: "ATTRACTION_TICKET", label: "Attraction Ticket" },
  { value: "COMBO", label: "Combo" },
  { value: "OTHER", label: "Other" },
];

const createInitialServiceForm = (item) => ({
  name: item?.source?.name || "",
  type:
    item?.source?.type === "ATTRACTION"
      ? "ACTIVITY"
      : item?.source?.type || item?.normalizedType || "ACTIVITY",
  address: item?.source?.address || "",
  description: item?.source?.description || "",
  status: "ACTIVE",
  priceAdult: getSuggestedPrice(item?.source, "ADULT"),
  priceChild: getSuggestedPrice(item?.source, "CHILD"),
  priceInfant: getSuggestedPrice(item?.source, "INFANT"),
});

function MissingServiceDialog({ item, open, onOpenChange, onCreated }) {
  const [formData, setFormData] = useState(createInitialServiceForm(item));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(createInitialServiceForm(item));
  }, [item]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên service");
      return;
    }

    setLoading(true);
    try {
      const total = [];

      if (formData.priceAdult !== "") {
        total.push({ type: "ADULT", price: Number(formData.priceAdult) || 0 });
      }
      if (formData.priceChild !== "") {
        total.push({ type: "CHILD", price: Number(formData.priceChild) || 0 });
      }
      if (formData.priceInfant !== "") {
        total.push({ type: "INFANT", price: Number(formData.priceInfant) || 0 });
      }

      await createService({
        name: formData.name.trim(),
        type: formData.type,
        address: formData.address,
        description: formData.description,
        status: formData.status,
        total,
      });

      toast.success("Đã tạo service cho AI request");
      onCreated?.();
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể tạo service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo service còn thiếu</DialogTitle>
          <DialogDescription>
            Provider chưa có service này. Bạn có thể tạo nhanh theo dữ liệu traveler gửi lên rồi tạo tour ngay sau đó.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Tên service</Label>
            <Input
              value={formData.name}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Tên service"
            />
          </div>

          <div className="grid gap-2">
            <Label>Loại service</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại service" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label>Địa chỉ</Label>
            <Input
              value={formData.address}
              onChange={(event) => handleChange("address", event.target.value)}
              placeholder="Địa chỉ service"
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label>Mô tả</Label>
            <Textarea
              value={formData.description}
              onChange={(event) => handleChange("description", event.target.value)}
              className="min-h-28"
              placeholder="Mô tả ngắn"
            />
          </div>

          <div className="grid gap-2">
            <Label>Giá người lớn</Label>
            <Input
              type="number"
              min="0"
              value={formData.priceAdult}
              onChange={(event) => handleChange("priceAdult", event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="grid gap-2">
            <Label>Giá trẻ em</Label>
            <Input
              type="number"
              min="0"
              value={formData.priceChild}
              onChange={(event) => handleChange("priceChild", event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="grid gap-2">
            <Label>Giá em bé</Label>
            <Input
              type="number"
              min="0"
              value={formData.priceInfant}
              onChange={(event) => handleChange("priceInfant", event.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {loading ? "Đang tạo..." : "Lưu service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RequiredServiceCard({ item, onCreate }) {
  const priceAdult = item?.source?.total?.find((entry) => entry.type === "ADULT")?.price || 0;

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-950">{item?.source?.name || "Service"}</p>
          <p className="text-xs text-slate-500">{item?.source?.address || item?.normalizedType}</p>
        </div>
        <Badge variant={item.missing ? "warning" : "success"}>
          {item.missing ? "Missing" : "Matched"}
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

      {item.matchedService ? (
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          Đã dùng service hiện có: <span className="font-bold">{item.matchedService.name}</span>
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
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [activeMissingService, setActiveMissingService] = useState(null);

  const loadRequest = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProviderAiRequestDetail(id);
      setRequest(res?.data?.data || null);
    } catch (error) {
      console.error("Load AI request error:", error);
      toast.error(error?.response?.data?.message || "Không thể tải AI tour request.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const handleCreateTour = async () => {
    try {
      setConverting(true);
      const res = await convertProviderAiRequest(id);
      const tourId = res?.data?.data?.tour?._id;
      toast.success("Đã tạo tour đề xuất cho traveler");
      navigate(tourId ? `/provider/tours/${tourId}/schedule` : "/provider/manage-tours");
    } catch (error) {
      console.error("Convert AI request error:", error);
      toast.error(error?.response?.data?.message || "Không thể tạo tour từ AI request.");
      await loadRequest();
    } finally {
      setConverting(false);
    }
  };

  const missingCount = request?.missingServices?.length || 0;
  const canConvert = request?.status === "PUBLISHED" && missingCount === 0;
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
        onOpenChange={setServiceDialogOpen}
        onCreated={loadRequest}
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

            <div className="grid gap-3 sm:grid-cols-3">
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
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-bold">{request.location}</p>
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Base price</p>
              <p className="mt-2 text-sm">Adult: {formatPrice(request.price?.ADULT || 0)}</p>
              <p className="text-sm">Child: {formatPrice(request.price?.CHILD || 0)}</p>
              <p className="text-sm">Infant: {formatPrice(request.price?.INFANT || 0)}</p>
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
                onCreate={(currentItem) => {
                  setActiveMissingService(currentItem);
                  setServiceDialogOpen(true);
                }}
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
