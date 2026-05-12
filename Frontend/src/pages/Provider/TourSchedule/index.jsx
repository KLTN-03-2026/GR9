import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";

import ScheduleTable from "./ScheduleTable";
import ScheduleDialog from "./ScheduleDialog";

import {
    getTourSchedules,
    createTourSchedule,
    updateTourSchedule,
    deleteTourSchedule,
} from "@/services/api/tourSchedule";
import { getTourById } from "@/services/api/guest";
import ScheduleSkeleton from "./ScheduleSkeleton";
export default function TourSchedulePage() {
    const { id: tourId } = useParams();
    const location = useLocation();

    // ================= STATE =================
    const [schedules, setSchedules] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [forcePrivate, setForcePrivate] = useState(false);
    const prefillDepartureDate = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const value = searchParams.get("prefillDate");
        if (!value) return null;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }, [location.search]);
    const shouldAutoOpen = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get("autoOpen") === "1";
    }, [location.search]);

    // ================= FETCH =================
    const fetchSchedules = async () => {
        try {
            setIsLoading(true);

            const res = await getTourSchedules(tourId);
            setSchedules(res?.data?.data || []);
        } catch (error) {
            console.error("Fetch schedules error:", error);
            toast.error("Failed to load schedules");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tourId) fetchSchedules();
    }, [tourId]);

    useEffect(() => {
        if (!shouldAutoOpen || isLoading || schedules.length > 0) return;
        setSelectedSchedule(null);
        setIsDialogOpen(true);
    }, [isLoading, schedules.length, shouldAutoOpen]);

    useEffect(() => {
        if (!tourId) return;

        getTourById(tourId)
            .then((res) => {
                const tour = res?.data?.data;
                setForcePrivate(tour?.bookingAccess === "TARGET_TRAVELER_ONLY");
            })
            .catch(() => {
                setForcePrivate(false);
            });
    }, [tourId]);

    // ================= OPEN CREATE =================
    const handleOpenCreate = () => {
        setSelectedSchedule(null);
        setIsDialogOpen(true);
    };

    // ================= OPEN EDIT =================
    const handleOpenEdit = (schedule) => {
        setSelectedSchedule(schedule);
        setIsDialogOpen(true);
    };

    // ================= SUBMIT (CREATE / UPDATE) =================
    const handleSubmit = async (formData) => {
        try {
            setIsSaving(true);

            if (selectedSchedule) {
                await updateTourSchedule(tourId, selectedSchedule._id, formData);
                toast.success("Schedule updated");
            } else {
                await createTourSchedule(tourId, formData);
                toast.success("Schedule created");
            }

            setIsDialogOpen(false);
            setSelectedSchedule(null);
            fetchSchedules();
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message ||
                    "Không thể lưu lịch khởi hành. Vui lòng thử lại.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ================= DELETE =================
    const handleDelete = async (scheduleId) => {
        try {
            await deleteTourSchedule(tourId, scheduleId);
            toast.success("Schedule deleted");
            fetchSchedules();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    // ================= UI =================
    return (
        <section className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
                {/* HEADER (UPGRADED UI STYLE) */}
                <div className="flex flex-col gap-4 rounded-2xl border bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100">
                            <CalendarDays className="size-5 text-slate-600" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Tour Schedule</h1>
                            <p className="text-sm text-slate-500">Manage departure dates & booking slots</p>
                        </div>
                    </div>

                    <Button onClick={handleOpenCreate} className="w-full rounded-xl font-semibold sm:w-auto">
                        <Plus className="size-4 mr-2" />
                        Add Schedule
                    </Button>
                </div>

                {/* TABLE */}

                {isLoading ? (
                    <ScheduleSkeleton />
                ) : (
                    <ScheduleTable schedules={schedules} onEdit={handleOpenEdit} onDelete={handleDelete} />
                )}
            </div>

            {/* DIALOG */}
            <ScheduleDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                loading={isSaving}
                initialData={selectedSchedule}
                tourId={tourId}
                forcePrivate={forcePrivate}
                prefillDepartureDate={prefillDepartureDate}
            />
        </section>
    );
}
