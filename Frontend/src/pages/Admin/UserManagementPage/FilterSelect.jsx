import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const FilterSelect = ({ filters, onFilterChange }) => {
  const { t } = useI18n();

  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-end">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
              {t("admin.users.searchUsers")}
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={filters.search || ""}
                onChange={(event) =>
                  onFilterChange({ search: event.target.value, page: 1 })
                }
                placeholder={t("admin.users.searchPlaceholder")}
                className="h-12 rounded-xl border-slate-200 bg-white pl-10 font-semibold text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-teal-500/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
              {t("admin.users.filterRole")}
            </Label>
            <Select
              value={filters.role}
              onValueChange={(value) => onFilterChange({ role: value, page: 1 })}
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-teal-500/40 shadow-sm text-slate-900 font-semibold">
                <SelectValue placeholder={t("admin.users.allRoles")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white">
                <SelectItem value="all" className="text-slate-900 font-medium py-2">{t("admin.users.allRoles")}</SelectItem>
                <SelectItem value="traveler" className="text-slate-900 font-medium py-2">Traveler</SelectItem>
                <SelectItem value="provider" className="text-slate-900 font-medium py-2">Provider</SelectItem>
                <SelectItem value="admin" className="text-slate-900 font-medium py-2">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
              {t("admin.users.filterStatus")}
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange({ status: value, page: 1 })}
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-teal-500/40 shadow-sm text-slate-900 font-semibold">
                <SelectValue placeholder={t("admin.users.allStatuses")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white">
                <SelectItem value="all" className="text-slate-900 font-medium py-2">{t("admin.users.allStatuses")}</SelectItem>
                <SelectItem value="active" className="text-teal-600 font-medium py-2">{t("admin.users.active")}</SelectItem>
                <SelectItem value="pending" className="text-amber-600 font-medium py-2">{t("admin.users.pending")}</SelectItem>
                <SelectItem value="banned" className="text-red-600 font-medium py-2">{t("admin.users.banned")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
              {t("admin.users.joinedDateRange")}
            </Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) =>
                onFilterChange({ dateRange: value, page: 1 })
              }
            >
              <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-teal-500/40 shadow-sm text-slate-900 font-semibold">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-400" />
                  <SelectValue placeholder={t("admin.users.allTime")} />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white">
                <SelectItem value="all" className="text-slate-900 font-medium py-2">{t("admin.users.allTime")}</SelectItem>
                <SelectItem value="7" className="text-slate-900 font-medium py-2">{t("admin.users.last7")}</SelectItem>
                <SelectItem value="30" className="text-slate-900 font-medium py-2">{t("admin.users.last30")}</SelectItem>
                <SelectItem value="90" className="text-slate-900 font-medium py-2">{t("admin.users.last90")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSelect;
