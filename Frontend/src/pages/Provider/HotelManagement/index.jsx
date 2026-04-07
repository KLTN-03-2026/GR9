import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilLine, Plus, Search, Trash2 } from "lucide-react";
import { Dialog } from "radix-ui";
import React, { Fragment, useState } from "react";
import { DialogHotel } from "./DialogHotel";
import { DialogDeleteHotel } from "./DialogDeleteHotel";
const hotelsCurrent = [
    {
        id: 1,
        id_provider: 101,
        name: "Furama Resort Danang",
        description: "Resort 5 sao nổi tiếng ven biển Mỹ Khê",
        address: "103 Vo Nguyen Giap, Ngu Hanh Son",
        city: "Da Nang",
        lat: 16.0486,
        long: 108.2472,
        is_active: true,
    },
    {
        id: 2,
        id_provider: 101,
        name: "Hyatt Regency Danang Resort and Spa",
        description: "Resort cao cấp với view biển và dịch vụ spa",
        address: "05 Truong Sa, Ngu Hanh Son",
        city: "Da Nang",
        lat: 16.0035,
        long: 108.264,
        is_active: false,
    },
    {
        id: 3,
        id_provider: 102,
        name: "Novotel Danang Premier Han River",
        description: "Khách sạn trung tâm gần sông Hàn",
        address: "36 Bach Dang, Hai Chau",
        city: "Da Nang",
        lat: 16.0703,
        long: 108.224,
        is_active: true,
    },
    {
        id: 4,
        id_provider: 102,
        name: "Muong Thanh Luxury Song Han Hotel",
        description: "Khách sạn cao cấp gần trung tâm thành phố",
        address: "115 Nguyen Van Linh, Hai Chau",
        city: "Da Nang",
        lat: 16.0605,
        long: 108.2155,
        is_active: true,
    },
    {
        id: 5,
        id_provider: 103,
        name: "TMS Hotel Da Nang Beach",
        description: "Khách sạn gần biển Mỹ Khê, phù hợp du lịch nghỉ dưỡng",
        address: "292 Vo Nguyen Giap, Ngu Hanh Son",
        city: "Da Nang",
        lat: 16.0544,
        long: 108.2485,
        is_active: true,
    },
    {
        id: 6,
        id_provider: 103,
        name: "Brilliant Hotel",
        description: "Khách sạn view sông Hàn, gần cầu Rồng",
        address: "162 Bach Dang, Hai Chau",
        city: "Da Nang",
        lat: 16.0612,
        long: 108.2245,
        is_active: true,
    },
    {
        id: 7,
        id_provider: 104,
        name: "HAIAN Beach Hotel & Spa",
        description: "Khách sạn 4 sao sát biển, view đẹp",
        address: "278 Vo Nguyen Giap, Ngu Hanh Son",
        city: "Da Nang",
        lat: 16.054,
        long: 108.2478,
        is_active: true,
    },
    {
        id: 8,
        id_provider: 104,
        name: "Risemount Premier Resort Da Nang",
        description: "Resort phong cách Santorini độc đáo",
        address: "120 Nguyen Van Thoai, Ngu Hanh Son",
        city: "Da Nang",
        lat: 16.0515,
        long: 108.2405,
        is_active: true,
    },
    {
        id: 9,
        id_provider: 105,
        name: "Four Points by Sheraton Danang",
        description: "Khách sạn quốc tế gần biển, nhiều tiện ích",
        address: "120 Vo Nguyen Giap, Son Tra",
        city: "Da Nang",
        lat: 16.075,
        long: 108.252,
        is_active: true,
    },
    {
        id: 10,
        id_provider: 105,
        name: "Grand Mercure Danang",
        description: "Khách sạn cao cấp gần trung tâm, phù hợp công tác",
        address: "Lot A1 Zone of the Villas, Green Island",
        city: "Da Nang",
        lat: 16.041,
        long: 108.223,
        is_active: true,
    },
];
export default function HotelManagement() {
    const [hotels, setHotels] = useState(hotelsCurrent);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [title, setTitle] = useState(false);
    const [hotel, setHotel] = useState(null);
    const handleOpenDialogCreate = () => {
        setOpen(true);
        setTitle("Create Hotel");
        setHotel(null);
    };
    const handleOpenDialogUpdate = (value) => {
        setOpen(true);
        setTitle("Update Hotel");
        setHotel(value);
    };
    return (
        <Fragment>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-primary">Hotels</h1>
                    <p className="text-sm text-muted-foreground">Manage your hotel listings</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-[260px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search hotels..."
                            className="pl-9 h-10 rounded-xl bg-white border-none text-primary"
                        />
                    </div>
                    <Button
                        onClick={handleOpenDialogCreate}
                        className="h-10 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 shadow-sm flex items-center gap-2 hover:scale-102"
                    >
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">New Hotel</span>
                    </Button>
                </div>
            </div>
            <div className="w-full overflow-x-auto rounded-2xl border bg-white">
                <Table className="min-w-[1100px] text-sm text-primary">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                Image
                            </TableHead>
                            <TableHead className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                Hotel
                            </TableHead>
                            <TableHead className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                Description
                            </TableHead>
                            <TableHead className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                Address
                            </TableHead>
                            <TableHead className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                City
                            </TableHead>
                            <TableHead className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                Location
                            </TableHead>
                            <TableHead className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">
                                Status
                            </TableHead>
                            <TableHead className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {hotels?.map((value) => (
                            <TableRow key={value.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="px-6 py-4 font-medium">
                                    <img
                                        src="https://cdn3.ivivu.com/2014/01/SUPER-DELUXE2.jpg"
                                        className="rounded-md"
                                        alt=""
                                    />
                                </TableCell>
                                <TableCell className="px-6 py-4 font-medium">{value.name}</TableCell>
                                <TableCell className="px-6 py-4 text-muted-foreground max-w-[250px] truncate">
                                    {value.description}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-muted-foreground">{value.address}</TableCell>
                                <TableCell className="px-6 py-4">{value.city}</TableCell>
                                <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                                    {value.lat}, {value.long}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            value.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {value.is_active ? "Active" : "Inactive"}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            onClick={() => handleOpenDialogUpdate(value)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-500 hover:text-teal-600 bg-slate-50"
                                        >
                                            <PencilLine className="size-4" />
                                        </Button>
                                        <Button
                                            onClick={() => setOpenDelete(true)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-500 hover:text-red-600 bg-slate-50"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <DialogHotel open={open} setOpen={setOpen} title={title} hotel={hotel} setHotel={setHotel} />
            <DialogDeleteHotel open={openDelete} setOpen={setOpenDelete}></DialogDeleteHotel>
        </Fragment>
    );
}
