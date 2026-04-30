import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, CalendarDays } from "lucide-react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-emerald-100 text-emerald-800",
    FULL: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-200 text-gray-600",
};

export default function ScheduleTable({ schedules, onEdit, onDelete }) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">

            {/* HEADER giống tour UI */}
            <div className="flex items-center justify-between px-6 py-5 border-b bg-slate-50/60">
                <div className="flex items-center gap-2">
                    <CalendarDays className="size-5 text-slate-600" />
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600">
                        Tour Schedules
                    </h2>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50/60">
                        <TableRow>
                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                                Departure
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                                Slots
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                                Booked
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                                Status
                            </TableHead>

                            <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                                Type
                            </TableHead>

                            <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {schedules?.length > 0 ? (
                            schedules.map((item) => (
                                <TableRow
                                    key={item._id}
                                    className="group hover:bg-slate-50 transition"
                                >
                                    {/* DATE */}
                                    <TableCell className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-slate-800 group-hover:text-primary transition">
                                                {item.departureDate
                                                    ? new Date(item.departureDate).toLocaleDateString()
                                                    : "-"}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Departure date
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* SLOTS */}
                                    <TableCell className="px-6 py-5">
                                        <div className="text-sm text-slate-700 font-medium">
                                            {item.minSlots} → {item.maxSlots}
                                        </div>
                                        <p className="text-xs text-slate-400">capacity</p>
                                    </TableCell>

                                    {/* BOOKED */}
                                    <TableCell className="px-6 py-5">
                                        <p className="font-semibold text-slate-700">
                                            {item.currentBooked ?? 0}
                                        </p>
                                        <p className="text-xs text-slate-400">people</p>
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
                                    colSpan={6}
                                    className="text-center py-16 text-slate-400"
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
        </div>
    );
}