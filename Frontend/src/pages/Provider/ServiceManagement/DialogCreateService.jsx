import React, { useEffect, useMemo, useState } from "react";
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
import { createService, parseAliasesInput, uploadServiceImage } from "@/services/api/service";
import { toast } from "react-hot-toast";
import { Upload, X } from "lucide-react";

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

const getInitialServiceState = (initialValues = {}) => ({
  name: initialValues.name || "",
  type: initialValues.type || "HOTEL",
  address: initialValues.address || "",
  lat: initialValues.lat ?? "",
  long: initialValues.long ?? "",
  description: initialValues.description || "",
  aliases: initialValues.aliases || "",
  status: initialValues.status || "ACTIVE",
  priceAdult: initialValues.priceAdult ?? "",
  priceChild: initialValues.priceChild ?? "",
  priceInfant: initialValues.priceInfant ?? "",
});

const DialogCreateService = ({
  open,
  setOpen,
  onCreated,
  initialValues,
  title = "Tạo dịch vụ mới",
  description = "Nhập thông tin dịch vụ để lưu lại.",
  submitLabel = "Lưu dịch vụ",
  submittingLabel = "Đang lưu...",
  successMessage = "Tạo dịch vụ thành công.",
}) => {
  const initialState = useMemo(() => getInitialServiceState(initialValues), [initialValues]);
  const [serviceData, setServiceData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setServiceData(initialState);
    setImageFile(null);
    setImagePreview(null);
  }, [initialState, open]);

  const handleChange = (key, value) => {
    setServiceData((prev) => ({ ...prev, [key]: value }));
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

  const validateServiceForm = () => {
    if (!serviceData.name.trim()) return "Vui lòng nhập tên dịch vụ.";
    if (!serviceData.type) return "Vui lòng chọn loại dịch vụ.";
    if (
      serviceData.lat !== "" &&
      (Number.isNaN(Number(serviceData.lat)) || Number(serviceData.lat) < -90 || Number(serviceData.lat) > 90)
    ) {
      return "Vĩ độ phải nằm trong khoảng -90 đến 90.";
    }
    if (
      serviceData.long !== "" &&
      (Number.isNaN(Number(serviceData.long)) || Number(serviceData.long) < -180 || Number(serviceData.long) > 180)
    ) {
      return "Kinh độ phải nằm trong khoảng -180 đến 180.";
    }
    if (
      [serviceData.priceAdult, serviceData.priceChild, serviceData.priceInfant].some(
        (value) => value !== "" && Number(value) < 0,
      )
    ) {
      return "Giá dịch vụ không được âm.";
    }
    if (imageFile && !imageFile.type.startsWith("image/")) return "File tải lên phải là hình ảnh.";
    return "";
  };

  const handleSubmit = async () => {
    const validationMessage = validateServiceForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setLoading(true);
    try {
      const total = [];
      if (serviceData.priceAdult) {
        total.push({
          type: "ADULT",
          price: Number(serviceData.priceAdult) || 0,
        });
      }
      if (serviceData.priceChild) {
        total.push({
          type: "CHILD",
          price: Number(serviceData.priceChild) || 0,
        });
      }
      if (serviceData.priceInfant) {
        total.push({
          type: "INFANT",
          price: Number(serviceData.priceInfant) || 0,
        });
      }

      const payload = {
        name: serviceData.name,
        type: serviceData.type,
        address: serviceData.address,
        lat: serviceData.lat === "" ? null : Number(serviceData.lat),
        long: serviceData.long === "" ? null : Number(serviceData.long),
        description: serviceData.description,
        aliases: parseAliasesInput(serviceData.aliases),
        status: serviceData.status,
        total,
      };

      const serviceRes = await createService(payload);
      const createdService = serviceRes?.data?.data;
      const newServiceId = createdService?._id;

      // Upload image if provided
      if (imageFile && newServiceId) {
        const formData = new FormData();
        formData.append("images", imageFile);
        await uploadServiceImage(newServiceId, formData);
      }

      toast.success(successMessage);
      setOpen(false);
      setServiceData(getInitialServiceState());
      removeImage();
      onCreated?.(createdService);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể tạo dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl sm:max-w-2xl">
        <DialogHeader className="shrink-0 pr-8">
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 overflow-y-auto py-2 pr-1 sm:grid-cols-2">
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
          <div className="grid gap-2">
            <Label>Vĩ độ (lat)</Label>
            <Input
              type="number"
              step="any"
              value={serviceData.lat}
              onChange={(e) => handleChange("lat", e.target.value)}
              placeholder="Ví dụ: 16.047079"
            />
          </div>
          <div className="grid gap-2">
            <Label>Kinh độ (long)</Label>
            <Input
              type="number"
              step="any"
              value={serviceData.long}
              onChange={(e) => handleChange("long", e.target.value)}
              placeholder="Ví dụ: 108.206230"
            />
          </div>
          <div className="col-span-1 sm:col-span-2 grid gap-2">
            <Label>Mô tả</Label>
            <Textarea
              className="min-h-35"
              value={serviceData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả ngắn gọn về dịch vụ"
            />
          </div>
          <div className="col-span-1 sm:col-span-2 grid gap-2">
            <Label>Alias tên dịch vụ</Label>
            <Input
              value={serviceData.aliases}
              onChange={(e) => handleChange("aliases", e.target.value)}
              placeholder="Ví dụ: Bana Hills, Sun World Ba Na"
            />
          </div>
          <div className="grid gap-2">
            <Label>Giá người lớn</Label>
            <Input
              type="number"
              value={serviceData.priceAdult}
              onChange={(e) => handleChange("priceAdult", e.target.value)}
              placeholder="Nhập giá người lớn"
            />
          </div>
          <div className="grid gap-2">
            <Label>Giá trẻ em</Label>
            <Input
              type="number"
              value={serviceData.priceChild}
              onChange={(e) => handleChange("priceChild", e.target.value)}
              placeholder="Nhập giá trẻ em"
            />
          </div>
          <div className="grid gap-2">
            <Label>Giá trẻ sơ sinh</Label>
            <Input
              type="number"
              value={serviceData.priceInfant}
              onChange={(e) => handleChange("priceInfant", e.target.value)}
              placeholder="Nhập giá trẻ sơ sinh"
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
              <label className="flex h-32 w-full cursor-pointer appearance-none items-center justify-center rounded-lg border-2 border-dashed border-outline-variant/35 bg-surface-container-lowest px-4 transition hover:border-primary/45 hover:bg-primary/5 focus:outline-none">
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-on-surface-variant" />
                  <span className="text-sm text-on-surface-variant">
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

        <DialogFooter className="mt-2 shrink-0">
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-primary-container hover:text-on-primary-container"
            disabled={loading}
          >
            {loading ? submittingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateService;
