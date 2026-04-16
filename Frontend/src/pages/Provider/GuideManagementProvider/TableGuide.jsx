import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilLine, Trash2 } from "lucide-react";
import React from "react";

const TableGuide = ({ guides, handleUpdate, handleDelete }) => {
  if (!guides) return null;
  return (
    <div>
      <Table className="w-full text-left border-collapse">
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Guide
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Contact Info
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Assigned Booking
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Active
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-100">
          {guides.map((g) => {
            const activeClasses = g.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-500 border border-slate-200";
            const statusClasses =
              g.status === "NOT_STARTED"
                ? "bg-gray-100 text-gray-600 border border-emerald-200"
                : g.status === "CHECKED_IN"
                  ? "bg-blue-100 text-blue-700 border border-amber-200"
                  : g.status === "ON_GOING"
                    ? "bg-indigo-100 text-indigo-700 border border-emerald-200"
                    : g.status === "COMPLETED"
                      ? "bg-green-100 text-green-700 border border-rose-200"
                      : g.status === "CANCELLED"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-rose-100 text-rose-700 border border-slate-200";

            return (
              <TableRow
                key={g.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                      <img
                        alt={g.name}
                        className="w-full h-full object-cover"
                        src={g.avatarUrl}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{g.fullName}</p>
                      <p className="text-xs text-slate-500">{g.specialty}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <p className="text-slate-900 font-medium">{g.email}</p>
                    <p className="text-slate-500 text-xs mt-1">{g.phone}</p>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">
                      {g.bookingTitle}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {g.bookingCode}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusClasses}`}
                  >
                    {g.status === "NOT_STARTED"
                      ? "Not Started"
                      : g.status === "CHECKED_IN"
                        ? "Checked In"
                        : g.status === "ON_GOING"
                          ? "On Going"
                          : g.status === "COMPLETED"
                            ? "Completed"
                            : "Cancelled"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${activeClasses}`}
                  >
                    {g.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => handleUpdate(g._id)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-teal-600 bg-slate-50"
                    >
                      <PencilLine className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(g._id)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-red-600 bg-slate-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableGuide;
