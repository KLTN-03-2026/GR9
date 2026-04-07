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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function DialogHotel({ open, setOpen, title, handleClick, hotel, setHotel }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                    <DialogDescription>{title} hotel information below</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="col-span-2 grid gap-2">
                        <Label>Image URL</Label>
                        <label className="flex items-center justify-center h-10 px-4 rounded-xl border bg-muted/40 cursor-pointer hover:bg-muted transition">
                            <span className="text-sm text-muted-foreground">Choose image</span>

                            <Input type="file" className="hidden" />
                        </label>
                    </div>
                    <div className="grid gap-2">
                        <Label>Hotel Name</Label>
                        <Input
                            value={hotel?.name}
                            onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
                            placeholder="Enter hotel name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>City</Label>
                        <Input
                            value={hotel?.city}
                            onChange={(e) => setHotel({ ...hotel, city: e.target.value })}
                            placeholder="City name"
                        />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <Label>Address</Label>
                        <Input
                            value={hotel?.address}
                            onChange={(e) => setHotel({ ...hotel, address: e.target.value })}
                            placeholder="Street address"
                        />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <Label>Description</Label>
                        <Input
                            value={hotel?.description}
                            onChange={(e) => setHotel({ ...hotel, description: e.target.value })}
                            placeholder="Short description..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Latitude</Label>
                        <Input
                            value={hotel?.lat}
                            onChange={(e) => setHotel({ ...hotel, lat: e.target.value })}
                            placeholder="16.05..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Longitude</Label>
                        <Input
                            value={hotel?.long}
                            onChange={(e) => setHotel({ ...hotel, long: e.target.value })}
                            placeholder="108.24..."
                        />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <Label>Status</Label>
                        <Select
                            value={hotel?.is_active ? "true" : "false"}
                            onValueChange={(value) => {
                                setHotel({
                                    ...hotel,
                                    is_active: value === "true",
                                });
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="mt-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleClick} className="bg-teal-600 hover:bg-teal-700">
                            Save changes
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
