import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";

const categories = [
  { value: "All", label: "All" },
  { value: "HOTEL", label: "Accommodation" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "ACTIVITY", label: "Activity" },
  { value: "FOOD", label: "Food" },
  { value: "ATTRACTION_TICKET", label: "Attraction Ticket" },
  { value: "COMBO", label: "Combo" },
  { value: "OTHER", label: "Other" },
];

const ServiceFilter = ({
  category,
  onCategoryChange,
  search,
  onSearchChange,
  onAdd,
  showAddButton = true,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-12 pr-6 h-12 bg-white border border-slate-200 rounded-2xl focus-visible:ring-2 focus-visible:ring-teal-200 focus-visible:border-teal-300 text-sm"
            placeholder="Search services..."
          />
        </div>
        <div className="w-full md:w-56">
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full h-12 rounded-2xl border border-slate-200 bg-white font-bold text-slate-600 outline-none focus-visible:border-teal-300 focus-visible:ring-0 data-[state=open]:border-slate-200 data-[state=open]:ring-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <SelectValue placeholder="Select type" />
              </div>
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="rounded-2xl border-slate-100"
            >
              {categories.map((cat) => (
                <SelectItem
                  key={cat.value}
                  value={cat.value}
                  className="font-medium focus:bg-teal-50 focus:text-teal-700 rounded-xl cursor-pointer"
                >
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {showAddButton ? (
        <div className="w-full lg:w-auto">
          <Button
            onClick={onAdd}
            className="w-full lg:w-auto rounded-full px-8 py-6 font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-900/10 transition-all group"
          >
            <span className=" mr-2 group-hover:rotate-90 transition-transform">
              <Plus className="h-4 w-4" />
            </span>
            ADD NEW SERVICE
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ServiceFilter;
