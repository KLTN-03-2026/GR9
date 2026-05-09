import { ChevronLeft, ChevronRight, Filter, MapPin, MoreVertical, Pencil, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/utils/formatPrice";
import { useNavigate } from "react-router-dom";

export default function ManageToursTable({ tours, handleDelete, handleEdit }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("latest");
    const [priceRange, setPriceRange] = useState([100000, 100000000]);
    const filteredTours = tours
        .filter((tour) => {
            const matchSearch =
                tour.name?.toLowerCase().includes(search.toLowerCase()) ||
                tour.location?.toLowerCase().includes(search.toLowerCase());

            const matchStatus = status === "all" ? true : tour.status?.toLowerCase() === status.toLowerCase();
            const matchPrice = (tour.price?.adult || 0) >= priceRange[0] && (tour.price?.adult || 0) <= priceRange[1];
            return matchSearch && matchStatus && matchPrice;
        })
        .sort((a, b) => {
            const priceA = a.price?.adult || 0;
            const priceB = b.price?.adult || 0;

            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);

            if (sort === "price-low") return priceA - priceB;
            if (sort === "price-high") return priceB - priceA;

            return dateB - dateA;
        });
    return (
        <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <CardContent className="space-y-6 p-5 md:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <Tabs defaultValue="all" onValueChange={setStatus} className="w-full xl:w-auto">
                        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-surface-container-low p-1.5 xl:w-auto">
                            <TabsTrigger
                                value="all"
                                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
                            >
                                All Tours
                            </TabsTrigger>
                            <TabsTrigger
                                value="active"
                                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
                            >
                                active
                            </TabsTrigger>
                            <TabsTrigger
                                value="draft"
                                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
                            >
                                draft
                            </TabsTrigger>
                            <TabsTrigger
                                value="archived"
                                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
                            >
                                archived
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative min-w-[240px] flex-1 md:min-w-[300px]">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                            <Input
                                placeholder="Search tours or destinations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 rounded-xl border-outline-variant/30 bg-surface-container-low pl-10"
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-[220px]">
                            <p className="text-xs font-semibold text-on-surface-variant">Price Range</p>

                            <Slider
                                min={100000}
                                max={100000000}
                                step={50000}
                                value={priceRange}
                                onValueChange={setPriceRange}
                            />

                            <div className="flex justify-between text-xs text-on-surface-variant">
                                <span>{formatPrice(priceRange[0])} đ</span>
                                <span>{formatPrice(priceRange[1])} đ</span>
                            </div>
                        </div>

                        <Select defaultValue="latest" onValueChange={setSort}>
                            <SelectTrigger className="h-11 min-w-[150px] rounded-xl border-outline-variant/30 bg-white px-4">
                                <SelectValue placeholder="Sort: Latest" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="latest">Sort: Latest</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-outline-variant/20">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="hover:bg-slate-50/80">
                                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    Tour Details
                                </TableHead>
                                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    Price
                                </TableHead>
                                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    Booking Status
                                </TableHead>
                                <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredTours?.length > 0 ? (
                                filteredTours.map((tour) => (
                                    <TableRow className="group">
                                        <TableCell className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={
                                                        tour.images?.[0]?.imageUrl || "https://via.placeholder.com/100"
                                                    }
                                                    alt={tour.name}
                                                    className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-headline text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                                                        {tour.name}
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                                                        <MapPin className="size-3.5" />
                                                        {tour.location || "No location"}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-5">
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold text-primary">
                                                    {formatPrice(tour.price?.adult || 0)} đ
                                                </p>

                                                <div className="text-xs text-on-surface-variant space-y-[2px]">
                                                    <p>Child: {formatPrice(tour.price?.child || 0)} đ</p>
                                                    <p>Infant: {formatPrice(tour.price?.infant || 0)} đ</p>
                                                </div>

                                                <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">
                                                    per person
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-5">
                                            <Badge
                                                className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em]
                                                          ${
                                                              tour.status === "ACTIVE"
                                                                  ? "bg-emerald-100 text-emerald-800"
                                                                  : tour.status === "DRAFT"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-gray-200 text-gray-700"
                                                          }
                                                        `}
                                            >
                                                {tour.status || "DRAFT"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-5">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(tour)}
                                                    className="rounded-xl text-on-surface-variant hover:bg-surface-container-low"
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="rounded-xl text-on-surface-variant hover:bg-surface-container-low"
                                                        >
                                                            <MoreVertical className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem
                                                            onClick={() => navigate(`/provider/tours/${tour._id}/schedule`)}
                                                        >
                                                            Manage schedule
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Duplicate tour</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => handleDelete(tour)}
                                                        >
                                                            Archive tour
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                                        No tours found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-3 rounded-[1.5rem] bg-surface-container-low px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-on-surface-variant">
                        Showing <span className="font-bold text-on-surface">1 - 4</span> of{" "}
                        <span className="font-bold text-on-surface">24</span> tours
                    </p>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-xl bg-white text-on-surface-variant">
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button className="rounded-xl bg-primary px-4 text-on-primary">1</Button>
                        <Button variant="outline" className="rounded-xl bg-white px-4">
                            2
                        </Button>
                        <Button variant="outline" className="rounded-xl bg-white px-4">
                            3
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-xl bg-white text-on-surface-variant">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
