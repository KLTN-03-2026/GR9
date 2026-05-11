import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MoreVertical, 
  LockOpen, 
  Ban, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle 
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const UserDataGrid = ({
  users,
  pagination,
  loading,
  onPageChange,
  onUpdateStatus,
  onDeleteUser,
}) => {
  const { t } = useI18n();
  const total = pagination?.total || 0;
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const totalPages = pagination?.totalPages || 1;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">{t("admin.users.userName")}</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">{t("admin.users.role")}</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">{t("admin.users.status")}</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">{t("admin.users.dateJoined")}</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">{t("admin.users.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-44" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Skeleton className="ml-auto h-9 w-28 rounded-lg" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="px-6 py-10 text-center text-sm font-semibold text-slate-500">
                {t("admin.users.noUsers")}
              </TableCell>
            </TableRow>
          ) : users.map((user) => (
            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors group">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className={`h-10 w-10 rounded-xl ring-2 ring-white shadow-sm ${user.status === 'Banned' ? 'grayscale opacity-60' : ''}`}>
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="rounded-xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className={`font-bold text-slate-900 ${user.status === 'Banned' ? 'line-through text-slate-400' : ''}`}>
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="px-6 py-4">
                <Badge variant="secondary" className={`rounded-full px-3 py-0.5 text-[11px] font-bold shadow-none ${
                  user.role === 'Traveler' ? 'bg-slate-100 text-slate-600' : 'bg-teal-50 text-teal-700'
                }`}>
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-4">
                <div className={`flex items-center gap-2 ${
                  user.status === 'Active' ? 'text-teal-600' : user.status === 'Banned' ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {user.status === 'Banned' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-teal-600' : 'bg-slate-300'}`} />
                  )}
                  <span className="text-sm font-semibold">{user.status}</span>
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 text-sm font-medium text-slate-500">
                {user.date}
              </TableCell>

              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {user.status === 'Pending' ? (
                    <Button
                      size="sm"
                      className="h-8 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white font-bold text-[11px] rounded-full px-4 shadow-none border-none"
                      onClick={() => onUpdateStatus(user.id, "ACTIVE")}
                    >
                      {t("admin.users.activate")}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                        onClick={() => onUpdateStatus(user.id, "ACTIVE")}
                      >
                        {user.status === 'Banned' ? <RotateCcw className="h-5 w-5" /> : <LockOpen className="h-5 w-5" />}
                      </Button>
                      {user.status !== 'Banned' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          onClick={() => onUpdateStatus(user.id, "BANNED")}
                        >
                          <Ban className="h-5 w-5" />
                        </Button>
                      )}
                    </>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-slate-100 rounded-lg">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl w-40">
                      <DropdownMenuItem className="text-sm font-medium">{t("admin.users.viewProfile")}</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm font-medium">{t("admin.users.editDetails")}</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-sm font-medium text-red-600"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        {t("admin.users.deleteUser")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="px-6 py-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-100">
        <span className="text-sm text-slate-500 font-medium">
          {t("admin.users.showing", { start, end, total })}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button className="h-8 w-8 rounded-lg bg-teal-900 text-white text-xs font-bold shadow-sm hover:bg-teal-800">
            {page}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200 hover:bg-slate-200"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      </CardContent>
    </Card>
  );
};

export default UserDataGrid;
