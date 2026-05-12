import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useEffect, useState } from "react";
import { ChevronDown, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { getAvailableGuides } from "@/services/api/guide";

export default function ScheduleDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  initialData,
  tourId,
  forcePrivate = false,
  prefillDepartureDate = null,
}) {
  const [departureDate, setDepartureDate] = useState(null);
  const [minSlots, setMinSlots] = useState(1);
  const [maxSlots, setMaxSlots] = useState(10);
  const [isPrivate, setIsPrivate] = useState(false);
  const [leadGuideServiceId, setLeadGuideServiceId] = useState("");
  const [guides, setGuides] = useState([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (initialData) {
      setDepartureDate(
        initialData.departureDate ? new Date(initialData.departureDate) : null
      );
      setMinSlots(initialData.minSlots ?? 1);
      setMaxSlots(initialData.maxSlots ?? 10);
      setIsPrivate(forcePrivate ? true : !!initialData.isPrivate);
      setLeadGuideServiceId(
        initialData.leadGuideServiceId?._id || initialData.leadGuideServiceId || ""
      );
    } else {
      setDepartureDate(prefillDepartureDate ? new Date(prefillDepartureDate) : null);
      setMinSlots(1);
      setMaxSlots(10);
      setIsPrivate(forcePrivate);
      setLeadGuideServiceId("");
      setGuides([]);
    }
  }, [forcePrivate, initialData, open, prefillDepartureDate]);

  useEffect(() => {
    const fetchGuides = async () => {
      if (!open || !tourId || !departureDate) {
        setGuides([]);
        return;
      }

      try {
        setIsLoadingGuides(true);
        const res = await getAvailableGuides({
          tourId,
          startDate: departureDate.toISOString(),
          excludeScheduleId: initialData?._id,
          onlyAvailable: true,
        });
        const available = res?.data?.data || [];
        const currentGuide = initialData?.leadGuideServiceId;
        const normalizedCurrentGuide =
          currentGuide && typeof currentGuide === "object" ? currentGuide : null;
        const hasCurrentGuide =
          normalizedCurrentGuide &&
          available.some((guide) => guide._id === normalizedCurrentGuide._id);

        setGuides(
          normalizedCurrentGuide && !hasCurrentGuide
            ? [normalizedCurrentGuide, ...available]
            : available
        );
      } catch (error) {
        console.error("Load available guides error:", error);
        setGuides([]);
        toast.error(error?.response?.data?.message || "Không thể tải danh sách guide khả dụng.");
      } finally {
        setIsLoadingGuides(false);
      }
    };

    fetchGuides();
  }, [departureDate, initialData, open, tourId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!departureDate) {
      toast.error("Vui lòng chọn ngày khởi hành.");
      return;
    }

    const selectedDate = new Date(departureDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Ngày khởi hành phải từ hôm nay trở đi.");
      return;
    }

    if (!leadGuideServiceId) {
      toast.error("Vui lòng chọn guide còn trống cho lịch khởi hành.");
      return;
    }

    onSubmit({
      departureDate,
      leadGuideServiceId,
      minSlots: Number(minSlots),
      maxSlots: Number(maxSlots),
      isPrivate: forcePrivate ? true : isPrivate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-3xl bg-surface-container-lowest p-0 shadow-2xl">
        {/* HEADER */}
        <DialogHeader className="border-b border-outline-variant/20 bg-surface-container-low px-6 py-5">
          <DialogTitle className="text-2xl font-bold text-on-surface">
            {initialData ? "Edit Schedule" : "Create Schedule"}
          </DialogTitle>
          <DialogDescription className="text-sm text-on-surface-variant">
            Manage departure date and booking slots
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] overflow-y-auto px-6 py-6 space-y-8"
        >
          {/* DATE */}
          <div>
            <Label className="text-xs font-bold uppercase text-on-surface-variant">
              Departure Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 h-12 w-full justify-between rounded-xl bg-surface-container-lowest hover:bg-surface-container-low"
                >
                  {departureDate
                    ? departureDate.toLocaleDateString("vi-VN")
                    : "Pick departure date"}
                  <ChevronDown className="size-4 opacity-60" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-[calc(100vw-2rem)] rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-xl sm:w-[700px] sm:p-6"
                align="start"
                side="bottom"
                sideOffset={10}
              >
                <div className="flex gap-6">
                  {/* Calendar */}
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    disabled={(date) => {
                      const current = new Date(date);
                      current.setHours(0, 0, 0, 0);
                      return current < today;
                    }}
                    initialFocus
                    className="rounded-xl bg-surface-container-low p-4"
                    numberOfMonths={2}
                  />

                  {/* Sidebar info */}
                  <div className="flex-1 space-y-4">
                    <p className="text-lg font-semibold text-on-surface">
                      {departureDate
                        ? `Selected: ${departureDate.toLocaleDateString("vi-VN")}`
                        : "No date selected"}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      Choose a departure date from the calendar. 
                      You can adjust slots below.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* GUIDE */}
          <div>
            <Label className="text-xs font-bold uppercase text-on-surface-variant">
              Lead Guide
            </Label>

            <Select
              value={leadGuideServiceId}
              onValueChange={setLeadGuideServiceId}
              disabled={!departureDate || isLoadingGuides}
            >
              <SelectTrigger className="mt-2 h-12 w-full rounded-xl border-outline-variant/30 bg-surface-container-lowest">
                <SelectValue
                  placeholder={
                    !departureDate
                      ? "Chọn ngày khởi hành trước"
                      : isLoadingGuides
                        ? "Đang kiểm tra guide còn trống..."
                        : "Chọn guide"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {guides.map((guide) => (
                  <SelectItem key={guide._id} value={guide._id}>
                    {guide.fullName || guide.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4 text-sm text-on-surface-variant">
              <UserCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
                Guide chỉ hiện khi không có tour khác trùng từ ngày bắt đầu đến ngày kết thúc của tour này.
              </p>
            </div>
          </div>

          {/* SLOTS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-bold uppercase text-on-surface-variant">
                Min Slots
              </Label>
              <Input
                type="number"
                value={minSlots}
                onChange={(e) => setMinSlots(Number(e.target.value))}
                className="mt-2 h-12 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase text-on-surface-variant">
                Max Slots
              </Label>
              <Input
                type="number"
                value={maxSlots}
                onChange={(e) => setMaxSlots(Number(e.target.value))}
                className="mt-2 h-12 rounded-xl"
              />
            </div>
          </div>

          {/* SWITCH */}
          <div className="flex items-center justify-between rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
            <div>
              <p className="font-semibold text-on-surface">Private Schedule</p>
              <p className="text-xs text-on-surface-variant">
                {forcePrivate
                  ? "Tour AI proposal này chỉ dành cho đúng traveler đó nên lịch khởi hành luôn là private"
                  : "Only visible to admin & owner"}
              </p>
            </div>
            <Switch
              checked={forcePrivate ? true : isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={forcePrivate}
            />
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-outline-variant/20 bg-surface-container-lowest pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
