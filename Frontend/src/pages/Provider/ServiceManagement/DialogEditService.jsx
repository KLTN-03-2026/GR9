import React, { useEffect, useState } from "react";
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
import { updateService, uploadServiceImage } from "@/services/api/service";
import { toast } from "react-hot-toast";
import { Upload, X } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");
const serviceTypes = [
  { value: "HOTEL", label: "Accommodation" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "ACTIVITY", label: "Activity" },
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

const DialogEditService = ({ open, setOpen, service, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "HOTEL",
    address: "",
    description: "",
    status: "ACTIVE",
    priceAdult: "",
    priceChild: "",
    priceInfant: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!service) {
      setFormData({
        name: "",
        type: "HOTEL",
        address: "",
        description: "",
        status: "ACTIVE",
        priceAdult: "",
        priceChild: "",
        priceInfant: "",
      });
      setImagePreview(null);
      return;
    }

    const adultPrice =
      service.total?.find((t) => t.type === "ADULT")?.price ?? "";
    const childPrice =
      service.total?.find((t) => t.type === "CHILD")?.price ?? "";
    const infantPrice =
      service.total?.find((t) => t.type === "INFANT")?.price ?? "";

    setFormData({
      name: service.name || "",
      type: service.type || "HOTEL",
      address: service.address || "",
      description: service.description || "",
      status: service.status || "ACTIVE",
      priceAdult: adultPrice,
      priceChild: childPrice,
      priceInfant: infantPrice,
    });

    if (service.image) {
      const fullUrl = service.image.startsWith("http")
        ? service.image
        : `${API_BASE_URL}${service.image}`;
      setImagePreview(fullUrl);
    } else {
      setImagePreview(null);
    }
  }, [service]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
  setImageFile(null);    
  setImagePreview(null); 
};

  const handleSubmit = async () => {
    if (!service?._id) {
      toast.error("Dịch vụ không hợp lệ.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên dịch vụ.");
      return;
    }

    setLoading(true);
    try {
      const total = [];
      if (formData.priceAdult) {
        total.push({ type: "ADULT", price: Number(formData.priceAdult) || 0 });
      }
      if (formData.priceChild) {
        total.push({ type: "CHILD", price: Number(formData.priceChild) || 0 });
      }
      if (formData.priceInfant) {
        total.push({
          type: "INFANT",
          price: Number(formData.priceInfant) || 0,
        });
      }

      const payload = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        description: formData.description,  
        status: formData.status,
        total,
        image: imagePreview ? service.image : "",
      };

      await updateService(service._id, payload);

      // Upload image if new file selected
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);
        await uploadServiceImage(service._id, formDataImage);
      }

      toast.success("Cập nhật dịch vụ thành công.");
      setOpen(false);
      onUpdated?.();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Không thể cập nhật dịch vụ.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
          <DialogDescription>
            Cập nhật nội dung và trạng thái dịch vụ.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="grid gap-2">
            <Label>Tên dịch vụ</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập tên dịch vụ"
            />
          </div>
          <div className="grid gap-2">
            <Label>Loại dịch vụ</Label>
            <Select
              value={formData.type}
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
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Nhập địa chỉ dịch vụ"
            />
          </div>
          <div className="col-span-1 sm:col-span-2 grid gap-2">
            <Label>Mô tả</Label>
            <Textarea
              className="min-h-35"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả ngắn gọn về dịch vụ"
            />
          </div>
          <div className="grid gap-2">
            <Label>Giá người lớn</Label>
            <Input
              type="number"
              value={formData.priceAdult}
              onChange={(e) => handleChange("priceAdult", e.target.value)}
              placeholder="Nhập giá người lớn"
            />
          </div>
          <div className="grid gap-2">
            <Label>Giá trẻ em</Label>
            <Input
              type="number"
              value={formData.priceChild}
              onChange={(e) => handleChange("priceChild", e.target.value)}
              placeholder="Nhập giá trẻ em"
            />
          </div>
          <div className="grid gap-2">
            <Label>Giá trẻ sơ sinh</Label>
            <Input
              type="number"
              value={formData.priceInfant}
              onChange={(e) => handleChange("priceInfant", e.target.value)}
              placeholder="Nhập giá trẻ sơ sinh"
            />
          </div>
          <div className="grid gap-2">
            <Label>Trạng thái</Label>
            <Select
              value={formData.status}
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
          <div className="col-span-1 sm:col-span-2 grid gap-2">
            <Label>Hình ảnh dịch vụ</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-500 text-sm">
                    Nhấp để chọn ảnh
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
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
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditService;
