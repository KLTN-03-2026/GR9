import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteService } from "@/services/api/service";
import { toast } from "react-hot-toast";

const DialogDeleteService = ({ open, setOpen, service, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!service?._id) {
      toast.error("Dịch vụ không hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      await deleteService(service._id);
      toast.success("Xoá dịch vụ thành công.");
      setOpen(false);
      onDeleted?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể xoá dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="rounded-2xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá dịch vụ</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xoá dịch vụ{" "}
            <strong>{service?.name || "này"}</strong>? Hành động này không thể
            hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={loading}
          >
            {loading ? "Đang xoá..." : "Xoá dịch vụ"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogDeleteService;
