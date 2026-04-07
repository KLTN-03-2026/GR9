import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DialogDeleteHotel({ open, setOpen }) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="rounded-2xl max-w-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete hotel</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this hotel? This action cannot be undone and the hotel will be
                        permanently removed from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
