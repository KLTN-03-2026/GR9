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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScheduleDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
  initialData,
}) {
  const [departureDate, setDepartureDate] = useState(null);
  const [minSlots, setMinSlots] = useState(1);
  const [maxSlots, setMaxSlots] = useState(10);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDepartureDate(
        initialData.departureDate ? new Date(initialData.departureDate) : null
      );
      setMinSlots(initialData.minSlots ?? 1);
      setMaxSlots(initialData.maxSlots ?? 10);
      setIsPrivate(!!initialData.isPrivate);
    } else {
      setDepartureDate(null);
      setMinSlots(1);
      setMaxSlots(10);
      setIsPrivate(false);
    }
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      departureDate,
      minSlots: Number(minSlots),
      maxSlots: Number(maxSlots),
      isPrivate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b bg-slate-50">
          <DialogTitle className="text-2xl font-bold">
            {initialData ? "Edit Schedule" : "Create Schedule"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
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
            <Label className="text-xs font-bold uppercase text-slate-500">
              Departure Date
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full h-12 justify-between rounded-xl hover:bg-slate-50"
                >
                  {departureDate
                    ? departureDate.toLocaleDateString("vi-VN")
                    : "Pick departure date"}
                  <ChevronDown className="size-4 opacity-60" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-[700px] p-6 rounded-2xl shadow-xl border bg-white"
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
                    initialFocus
                    className="rounded-xl bg-slate-50 p-4"
                    numberOfMonths={2}
                  />

                  {/* Sidebar info */}
                  <div className="flex-1 space-y-4">
                    <p className="font-semibold text-lg">
                      {departureDate
                        ? `Selected: ${departureDate.toLocaleDateString("vi-VN")}`
                        : "No date selected"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Choose a departure date from the calendar. 
                      You can adjust slots below.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* SLOTS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold uppercase text-slate-500">
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
              <Label className="text-xs font-bold uppercase text-slate-500">
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
          <div className="flex items-center justify-between p-4 rounded-2xl border bg-slate-50">
            <div>
              <p className="font-semibold">Private Schedule</p>
              <p className="text-xs text-slate-500">
                Only visible to admin & owner
              </p>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          {/* FOOTER */}
          <div className="border-t pt-5 flex justify-end gap-3 bg-white sticky bottom-0">
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
