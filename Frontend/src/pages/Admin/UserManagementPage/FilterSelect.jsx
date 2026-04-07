import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, UserPlus, ChevronDown } from "lucide-react";

const FilterSelect = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 items-end">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Filter by Role
          </Label>
          <Select>
            <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-teal-500/40 shadow-sm text-slate-900 font-semibold">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white">
              <SelectItem value="all" className="text-slate-900 font-medium py-2">All Roles</SelectItem>
              <SelectItem value="traveler" className="text-slate-900 font-medium py-2">Traveler</SelectItem>
              <SelectItem value="provider" className="text-slate-900 font-medium py-2">Provider</SelectItem>
              <SelectItem value="admin" className="text-slate-900 font-medium py-2">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Filter by Status
          </Label>
          <Select>
            <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-teal-500/40 shadow-sm text-slate-900 font-semibold">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white">
              <SelectItem value="all" className="text-slate-900 font-medium py-2">All Statuses</SelectItem>
              <SelectItem value="active" className="text-teal-600 font-medium py-2">Active</SelectItem>
              <SelectItem value="pending" className="text-amber-600 font-medium py-2">Pending</SelectItem>
              <SelectItem value="banned" className="text-red-600 font-medium py-2">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Joined Date Range */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Joined Date Range
          </Label>
          <Button 
            variant="outline" 
            className="w-full h-12 justify-start font-semibold rounded-xl border-slate-200 hover:bg-slate-50 shadow-sm text-slate-900"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
            <span>Last 30 Days</span>
            <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
          </Button>
        </div>
      </div>

      <Button className="h-12 px-6 bg-teal-900 hover:bg-teal-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap">
        <UserPlus className="h-5 w-5" />
        Create New User
      </Button>
    </div>
  );
};

export default FilterSelect;