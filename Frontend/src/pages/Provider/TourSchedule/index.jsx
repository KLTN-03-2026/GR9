import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import ScheduleSkeleton from "./ScheduleSkeleton";
export default function TourSchedulePage() {
    const { id: tourId } = useParams();

    // ================= STATE =================
    const [schedules, setSchedules] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            toast.error("Save failed");
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
        <section className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* HEADER (UPGRADED UI STYLE) */}
                <div className="flex items-center justify-between bg-white rounded-2xl border px-6 py-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100">
                            <CalendarDays className="size-5 text-slate-600" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Tour Schedule</h1>
                            <p className="text-sm text-slate-500">Manage departure dates & booking slots</p>
                        </div>
                    </div>

                    <Button onClick={handleOpenCreate} className="rounded-xl font-semibold">
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
            />
        </section>
    );
}
