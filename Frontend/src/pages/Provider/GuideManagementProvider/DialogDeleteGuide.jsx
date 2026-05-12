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
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border-outline-variant/20 bg-surface-container-lowest sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-on-surface">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <DialogDescription className="text-on-surface-variant">
              Are you sure you want to delete{" "}
              <span className="font-bold text-on-surface">{fullName}</span>?
            </DialogDescription>

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
                onClick={() => handleDeleteGuides()}
                disabled={loading}
                className="bg-destructive text-white shadow-md hover:bg-destructive/90"
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
