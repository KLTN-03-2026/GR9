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
import PaginationBar from "@/components/shared/pagination-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MoreVertical, 
  LockOpen, 
  Ban, 
  RotateCcw, 
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
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-surface-container-low">
      <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 dark:bg-white/[0.035] dark:hover:bg-white/[0.035]">
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t("admin.users.userName")}</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t("admin.users.role")}</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t("admin.users.status")}</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t("admin.users.dateJoined")}</TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right dark:text-slate-400">{t("admin.users.actions")}</TableHead>
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
              <TableCell colSpan={5} className="px-6 py-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t("admin.users.noUsers")}
              </TableCell>
            </TableRow>
          ) : users.map((user) => (
            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors group dark:border-white/10 dark:hover:bg-white/[0.035]">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className={`h-10 w-10 rounded-xl ring-2 ring-white shadow-sm dark:ring-white/10 ${user.status === 'Banned' ? 'grayscale opacity-60' : ''}`}>
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-300/15 dark:text-teal-100">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className={`font-bold text-slate-900 dark:text-white ${user.status === 'Banned' ? 'line-through !text-slate-400 dark:!text-slate-500' : ''}`}>
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="px-6 py-4">
                <Badge variant="secondary" className={`rounded-full px-3 py-0.5 text-[11px] font-bold shadow-none ${
                  user.role === 'Traveler' ? 'bg-slate-100 text-slate-600 dark:bg-white/7 dark:text-slate-300' : 'bg-teal-50 text-teal-700 dark:bg-teal-300/10 dark:text-teal-200'
                }`}>
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-4">
                <div className={`flex items-center gap-2 ${
                  user.status === 'Active' ? 'text-teal-600 dark:text-teal-300' : user.status === 'Banned' ? 'text-red-500 dark:text-red-300' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {user.status === 'Banned' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-teal-600 dark:bg-teal-300' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  )}
                  <span className="text-sm font-semibold">{user.status}</span>
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                {user.date}
              </TableCell>

              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {user.status === 'Pending' ? (
                    <Button
                      size="sm"
                      className="h-8 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white font-bold text-[11px] rounded-full px-4 shadow-none border-none dark:bg-teal-300/10 dark:text-teal-200 dark:hover:bg-teal-500 dark:hover:text-white"
                      onClick={() => onUpdateStatus(user.id, "ACTIVE")}
                    >
                      {t("admin.users.activate")}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg dark:text-slate-500 dark:hover:bg-teal-300/10 dark:hover:text-teal-200"
                        onClick={() => onUpdateStatus(user.id, "ACTIVE")}
                      >
                        {user.status === 'Banned' ? <RotateCcw className="h-5 w-5" /> : <LockOpen className="h-5 w-5" />}
                      </Button>
                      {user.status !== 'Banned' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg dark:text-slate-500 dark:hover:bg-red-300/10 dark:hover:text-red-200"
                          onClick={() => onUpdateStatus(user.id, "BANNED")}
                        >
                          <Ban className="h-5 w-5" />
                        </Button>
                      )}
                    </>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-slate-100 rounded-lg dark:text-slate-500 dark:hover:bg-white/10">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl w-40 dark:border-white/10 dark:bg-surface-container-high">
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
      
      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        previousLabel={t("common.previous")}
        nextLabel={t("common.next")}
        summary={t("admin.users.showing", { start, end, total })}
        className="rounded-none border-x-0 border-b-0 border-t border-slate-100 bg-slate-50/30 px-6 dark:border-white/10 dark:bg-white/[0.025]"
      />
      </CardContent>
    </Card>
  );
};

export default UserDataGrid;
