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

import React from "react";

const DialogDeleteGuide = ({
  open,
  onOpenChange,
  title,
  fullName,
  loading,
  handleDeleteGuides,
}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <DialogDescription className="text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-black">{fullName}</span>?
            </DialogDescription>

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
                onClick={() => handleDeleteGuides()}
                disabled={loading}
                className="bg-destructive hover:bg-destructive/90 text-white shadow-md"
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogDeleteGuide;
