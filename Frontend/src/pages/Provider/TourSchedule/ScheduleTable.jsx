import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaginationBar from "@/components/shared/pagination-bar";
import { Pencil, Trash2, CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import usePaginationScroll from "@/hooks/usePaginationScroll";

const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-emerald-100 text-emerald-800",
    FULL: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-200 text-gray-600",
};

export default function ScheduleTable({ schedules, onEdit, onDelete }) {
    const pageSize = 8;
    const [page, setPage] = useState(1);
    const safeSchedules = schedules || [];
    const totalPages = Math.max(1, Math.ceil(safeSchedules.length / pageSize));
    const visibleSchedules = useMemo(
        () => safeSchedules.slice((page - 1) * pageSize, page * pageSize),
        [safeSchedules, page],
    );
    const firstRow = safeSchedules.length === 0 ? 0 : (page - 1) * pageSize + 1;
    const lastRow = Math.min(page * pageSize, safeSchedules.length);

    useEffect(() => {
        setPage((current) => Math.min(current, totalPages));
    }, [totalPages]);

    usePaginationScroll([page]);

    return (
        <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">

            {/* HEADER giống tour UI */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-low px-6 py-5">
                <div className="flex items-center gap-2">
                    <CalendarDays className="size-5 text-on-surface-variant" />
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                        Tour Schedules
                    </h2>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-surface-container-low">
                        <TableRow>
                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                Departure
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                Slots
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                Booked
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                Guide
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                Status
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                Type
                            </TableHead>

                            <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {safeSchedules.length > 0 ? (
                            visibleSchedules.map((item) => (
                                <TableRow
                                    key={item._id}
                                    className="group transition hover:bg-surface-container-low"
                                >
                                    {/* DATE */}
                                    <TableCell className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-on-surface transition group-hover:text-primary">
                                                {item.departureDate
                                                    ? new Date(item.departureDate).toLocaleDateString()
                                                    : "-"}
                                            </p>
                                            <p className="text-xs text-on-surface-variant">
                                                Departure date
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* SLOTS */}
                                    <TableCell className="px-6 py-5">
                                        <div className="text-sm font-medium text-on-surface">
                                            {item.maxSlots}
                                        </div>
                                        <p className="text-xs text-on-surface-variant">capacity</p>
                                    </TableCell>

                                    {/* BOOKED */}
                                    <TableCell className="px-6 py-5">
                                        <p className="font-semibold text-on-surface">
                                            {item.currentBooked ?? 0}
                                        </p>
                                        <p className="text-xs text-on-surface-variant">people</p>
                                    </TableCell>

                                    <TableCell className="px-6 py-5">
                                        <p className="max-w-[180px] truncate font-semibold text-on-surface">
                                            {item.leadGuideServiceId?.fullName ||
                                                item.leadGuideServiceId?.email ||
                                                "Chưa chọn"}
                                        </p>
                                        <p className="max-w-[180px] truncate text-xs text-on-surface-variant">
                                            {item.leadGuideServiceId?.email || "Lead guide"}
                                        </p>
                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell className="px-6 py-5">
                                        <Badge
                                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide
                                            ${statusColor[item.status] || "bg-slate-100 text-slate-700"}`}
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>

                                    {/* TYPE */}
                                    <TableCell className="px-6 py-5">
                                        <Badge
                                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide
                                            ${
                                                item.isPrivate
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-emerald-100 text-emerald-800"
                                            }`}
                                        >
                                            {item.isPrivate ? "Private" : "Group"}
                                        </Badge>
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell className="px-6 py-5">
                                        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(item)}
                                                className="rounded-xl hover:bg-slate-100"
                                            >
                                                <Pencil className="size-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(item._id)}
                                                className="rounded-xl hover:bg-red-50 text-red-500"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-16 text-center text-on-surface-variant"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <CalendarDays className="size-10 opacity-40" />
                                        <p className="font-medium">No schedules found</p>
                                        <p className="text-sm">Create your first departure date</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {safeSchedules.length > pageSize ? (
                <PaginationBar
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    summary={`Showing ${firstRow} - ${lastRow} of ${safeSchedules.length} schedules`}
                    className="rounded-none border-x-0 border-b-0 border-t border-outline-variant/20 bg-surface-container-low"
                />
            ) : null}
        </div>
    );
}
