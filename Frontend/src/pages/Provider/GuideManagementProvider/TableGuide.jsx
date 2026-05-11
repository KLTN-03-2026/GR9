import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KeyRound, MailCheck, PencilLine, Trash2 } from "lucide-react";
import React from "react";

const TableGuide = ({
  guides,
  handleUpdate,
  handleDelete,
  handleSendPassword,
  sendingPasswordId,
}) => {
  if (!guides) return null;
  return (
    <div>
      
      <Table className="w-full text-left border-collapse gap-2 mt-4">
        
        <TableHeader>
          <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Guide
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Contact Info
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Assignment
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Login Access
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-outline-variant/25">
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
                key={g._id}
                className="transition-colors hover:bg-surface-container-high"
              >
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-surface-container-high">
                      <img
                        alt={g.name}
                        className="w-full h-full object-cover"
                        src={g.avatarUrl}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{g.fullName}</p>
                      <p className="text-xs text-on-surface-variant">{g.specialty}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <p className="font-medium text-on-surface">{g.email}</p>
                    <p className="mt-1 text-xs text-on-surface-variant">{g.phone}</p>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <p className="font-semibold text-on-surface">
                      {g.bookingTitle}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {g.bookingCode}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {g.assignedTourCount || 0} tours · {g.activeBookingCount || 0} active bookings
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
                  <div className="flex min-w-[140px] flex-col items-start gap-2">
                    <span
                      className={`inline-flex min-w-[118px] items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${activeClasses}`}
                    >
                      {g.isActive ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`inline-flex min-w-[118px] items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        g.hasPassword
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      {g.hasPassword ? "Password sent" : "No password"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => handleSendPassword(g._id)}
                      variant="ghost"
                      size="icon"
                      disabled={sendingPasswordId === g._id}
                      title={g.hasPassword ? "Resend guide password" : "Send guide password"}
                      className="text-slate-500 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 disabled:opacity-60"
                    >
                      <MailCheck className="size-4" />
                    </Button>
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
