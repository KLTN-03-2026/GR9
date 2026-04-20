import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TourEditorContent from "@/pages/Provider/EditTour/TourEditorContent";

export default function DialogCreateTour({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-[calc(100%-2rem)] overflow-hidden rounded-[2rem] border-none bg-surface p-0 sm:max-w-6xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <DialogTitle className="font-headline text-2xl font-extrabold text-on-surface">
            Create Tour
          </DialogTitle>
          <DialogDescription className="text-sm text-on-surface-variant">
            Fill in the tour details, itinerary, and logistics without leaving
            the manage tours dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(92vh-88px)] overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          <TourEditorContent
            mode="dialog"
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
