import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

export const DialogGuide = ({
  open,
  onOpenChange,
  fullName,
  email,
  phone,
  specialty,
  isActive,
  setFullName,
  setEmail,
  setPhone,
  setSpecialty,
  setIsActive,
  loading,
  handleAddGuide,
}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900">
              Add New Guide
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Fill in the details to add a new guide to your roster
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Guide Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  placeholder="Tên của bạn"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Specialty
                </label>
                <Input
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  placeholder="Mô tả"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  type="email"
                  placeholder="e.g. guide@voyager.vn"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Phone
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                  placeholder="+84..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Status
                </label>
                <Select
                value={isActive ? "active" : "inactive"}
                  onValueChange={(value) => setIsActive(value === "active")}
                  defaultValue="active"
                >
                  <SelectTrigger className="h-10 w-full border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-teal-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Upload Avatar
                </label>
                {/* ĐÂY CHÍNH LÀ NÚT CHỌN FILE UPLOAD ẢNH */}
                <Input
                  type="file"
                  accept="image/*"
                  className="text-slate-900 bg-slate-50 border-slate-200 focus-visible:ring-teal-500 cursor-pointer file:text-teal-600 file:font-semibold file:bg-teal-50 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-3"
                />
              </div>
            </div>

            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="text-slate-700 border-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleAddGuide}
                disabled={loading}
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white shadow-md"
              >
                {loading ? "Adding..." : "Add Guide"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default DialogGuide;
