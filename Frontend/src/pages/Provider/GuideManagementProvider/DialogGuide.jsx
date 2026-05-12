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

import { ImagePlus, MailCheck, X } from "lucide-react";
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
  gender,
  setGender,
  title,
  handleUpdateGuide,
  avatarFile,
  avatarPreview,
  setAvatarFile,
}) => {
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-outline-variant/20 bg-surface-container-lowest sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-on-surface">
              {title}
            </DialogTitle>
            <DialogDescription className="text-on-surface-variant">
              {title === "Add new guide"
                ? "Fill in the details to add a new guide to your roster"
                : "Fill in the details to update a guide in your roster"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {title === "Add new guide" ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest text-primary">
                    <MailCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      Tạo hồ sơ trước, gửi mật khẩu sau
                    </p>
                    <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                      Guide mới sẽ chưa có mật khẩu đăng nhập. Sau khi tạo, dùng nút email trong bảng để gửi mật khẩu tạm thời cho guide.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Guide Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-outline-variant/30 bg-surface-container-low text-on-surface focus-visible:ring-primary"
                  placeholder="Tên của bạn"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Specialty
                </label>
                <Input
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="border-outline-variant/30 bg-surface-container-low text-on-surface focus-visible:ring-primary"
                  placeholder="Mô tả"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-outline-variant/30 bg-surface-container-low text-on-surface focus-visible:ring-primary"
                  type="email"
                  placeholder="e.g. guide@voyager.vn"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Phone
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className="border-outline-variant/30 bg-surface-container-low text-on-surface focus-visible:ring-primary"
                  placeholder="+84..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Status
                </label>
                <Select
                  value={isActive ? "ACTIVE" : "INACTIVE"}
                  onValueChange={(value) => setIsActive(value === "ACTIVE" ? true : false)}
                  defaultValue="ACTIVE"
                >
                  <SelectTrigger className="h-10 w-full border-outline-variant/30 bg-surface-container-low text-on-surface focus-visible:ring-primary">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Gender
                </label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-10 w-full border-outline-variant/30 bg-surface-container-low text-on-surface focus-visible:ring-primary">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Upload Avatar
              </label>
              <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-3 sm:flex-row sm:items-center">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Guide avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                      <ImagePlus className="size-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="cursor-pointer border-outline-variant/30 bg-surface-container-lowest text-on-surface focus-visible:ring-primary file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:font-semibold file:text-primary"
                  />
                  {avatarFile ? (
                    <p className="mt-2 truncate text-xs text-on-surface-variant">
                      {avatarFile.name}
                    </p>
                  ) : null}
                </div>
                {avatarFile ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setAvatarFile(null)}
                    className="text-on-surface-variant hover:text-red-600"
                  >
                    <X className="size-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => {
                  if (title === "Add new guide") {
                    handleAddGuide();
                  } else {
                    handleUpdateGuide();
                  }
                }}
                disabled={loading} 
                className="bg-teal-600 text-white shadow-md hover:bg-teal-700"
              >
                {loading
                  ? title === "Update the guide"
                    ? "Updating..."
                    : "Adding..."
                  : title === "Update the guide"
                    ? "Update"
                    : "Add"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default DialogGuide;
