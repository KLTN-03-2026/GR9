import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createService } from "@/services/api/service";
import { toast } from "react-hot-toast";

const serviceTypes = [
  { value: "HOTEL", label: "Accommodation" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "TOUR_GUIDE", label: "Tour Guide" },
  { value: "FOOD", label: "Food" },
  { value: "ATTRACTION_TICKET", label: "Attraction Ticket" },
  { value: "COMBO", label: "Combo" },
  { value: "OTHER", label: "Other" },
];

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "BLOCKED", label: "Blocked" },
];

const DialogCreateService = ({ open, setOpen, onCreated }) => {
  const [serviceData, setServiceData] = useState({
    name: "",
    type: "HOTEL",
    address: "",
    description: "",
    status: "ACTIVE",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setServiceData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!serviceData.name.trim()) {
      toast.error("Vui lòng nhập tên dịch vụ.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: serviceData.name,
        type: serviceData.type,
        address: serviceData.address,
        description: serviceData.description,
        status: serviceData.status,
        total: serviceData.price
          ? [
              {
                type: "ADULT",
                price: Number(serviceData.price) || 0,
              },
            ]
          : [],
      };

      await createService(payload);
      toast.success("Tạo dịch vụ thành công.");
      setOpen(false);
      setServiceData({
        name: "",
        type: "HOTEL",
        address: "",
        description: "",
        status: "ACTIVE",
        price: "",
      });
      onCreated?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể tạo dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Tạo dịch vụ mới
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin dịch vụ để lưu lại.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="grid gap-2">
            <Label>Tên dịch vụ</Label>
            <Input
              value={serviceData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập tên dịch vụ"
            />
          </div>
          <div className="grid gap-2">
            <Label>Loại dịch vụ</Label>
            <Select
              value={serviceData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Địa chỉ</Label>
            <Input
              value={serviceData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Nhập địa chỉ dịch vụ"
            />
          </div>
          <div className="col-span-1 sm:col-span-2 grid gap-2">
            <Label>Mô tả</Label>
            <Textarea
              className="min-h-[140px]"
              value={serviceData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả ngắn gọn về dịch vụ"
            />
          </div>
          <div className="grid gap-2">
            <Label>Giá trị</Label>
            <Input
              type="number"
              value={serviceData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="Nhập giá dịch vụ"
            />
          </div>
          <div className="grid gap-2">
            <Label>Trạng thái</Label>
            <Select
              value={serviceData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu dịch vụ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateService;
