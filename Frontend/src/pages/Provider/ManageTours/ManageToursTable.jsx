import { Filter, MapPin, MoreVertical, Pencil, Search } from "lucide-react";

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
import PaginationBar from "@/components/shared/pagination-bar";
import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { formatCurrencyVND, formatPrice } from "@/utils/formatPrice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import usePaginationScroll from "@/hooks/usePaginationScroll";

const bookingStatusConfig = {
    NO_BOOKING: {
        labelKey: "NO_BOOKING",
        className: "bg-slate-100 text-slate-700",
    },
    PENDING: {
        labelKey: "PENDING",
        className: "bg-amber-100 text-amber-800",
    },
    CONFIRMED: {
        labelKey: "CONFIRMED",
        className: "bg-emerald-100 text-emerald-800",
    },
    COMPLETED: {
        labelKey: "COMPLETED",
        className: "bg-blue-100 text-blue-800",
    },
    CANCELLED: {
        labelKey: "CANCELLED",
        className: "bg-red-100 text-red-700",
    },
    REFUNDED: {
        labelKey: "REFUNDED",
        className: "bg-slate-200 text-slate-700",
    },
};

const getBookingStatusBadge = (status) =>
    bookingStatusConfig[status] || {
        labelKey: status || "NO_BOOKING",
        className: "bg-slate-100 text-slate-700",
    };

const PAGE_SIZE = 6;

export default function ManageToursTable({ tours, handleDelete, handleEdit }) {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("latest");
    const [priceRange, setPriceRange] = useState([10000, 100000000]);
    const [page, setPage] = useState(1);

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (value.trim()) {
                next.set("search", value.trim());
            } else {
                next.delete("search");
            }
            return next;
        }, { replace: true });
    };

    const filteredTours = tours
        .filter((tour) => {
            const matchSearch =
                tour.name?.toLowerCase().includes(search.toLowerCase()) ||
                tour.location?.toLowerCase().includes(search.toLowerCase());

            const matchStatus =
                status === "all" ? true : tour.bookingStatus?.toLowerCase() === status.toLowerCase();
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
    const totalPages = Math.max(Math.ceil(filteredTours.length / PAGE_SIZE), 1);
    const currentPage = Math.min(page, totalPages);
    const visibleTours = useMemo(
        () => filteredTours.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredTours, currentPage],
    );
    const firstRow = filteredTours.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const lastRow = Math.min(currentPage * PAGE_SIZE, filteredTours.length);

    usePaginationScroll([currentPage]);

    return (
        <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <CardContent className="space-y-6 p-5 md:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <Tabs
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            setPage(1);
                        }}
                        className="w-full xl:w-auto"
                    >
                        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-surface-container-low p-1.5 xl:w-auto">
                            <TabsTrigger
                                value="all"
                                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-surface-container-lowest data-[state=active]:text-on-surface"
                            >
                                {t("provider.tours.all")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="confirmed"
                                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-surface-container-lowest data-[state=active]:text-on-surface"
                            >
                                {t("provider.tours.confirmed")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="pending"
                                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-surface-container-lowest data-[state=active]:text-on-surface"
                            >
                                {t("provider.tours.pending")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="completed"
                                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-surface-container-lowest data-[state=active]:text-on-surface"
                            >
                                {t("provider.tours.completed")}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative min-w-[240px] flex-1 md:min-w-[300px]">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                            <Input
                                placeholder={t("provider.tours.search")}
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="h-11 rounded-xl border-outline-variant/30 bg-surface-container-low pl-10"
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-[220px]">
                            <p className="text-xs font-semibold text-on-surface-variant">{t("provider.tours.priceRange")}</p>

                            <Slider
                                min={10000}
                                max={100000000}
                                step={50000}
                                value={priceRange}
                                onValueChange={(value) => {
                                    setPriceRange(value);
                                    setPage(1);
                                }}
                            />

                            <div className="flex justify-between text-xs text-on-surface-variant">
                                <span>{formatPrice(priceRange[0])} đ</span>
                                <span>{formatPrice(priceRange[1])} đ</span>
                            </div>
                        </div>

                        <Select
                            value={sort}
                            onValueChange={(value) => {
                                setSort(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="h-11 min-w-[150px] rounded-xl border-outline-variant/30 bg-surface-container-lowest px-4">
                                <SelectValue placeholder={t("provider.tours.sortLatest")} />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="latest">{t("provider.tours.sortLatest")}</SelectItem>
                                <SelectItem value="price-low">{t("provider.tours.priceLow")}</SelectItem>
                                <SelectItem value="price-high">{t("provider.tours.priceHigh")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-outline-variant/20">
                    <Table>
                        <TableHeader className="bg-surface-container-low">
                            <TableRow className="hover:bg-surface-container-low">
                                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    {t("provider.tours.tourDetails")}
                                </TableHead>
                                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    {t("provider.tours.price")}
                                </TableHead>
                                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    {t("provider.tours.bookingStatus")}
                                </TableHead>
                                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    {t("provider.tours.revenue")}
                                </TableHead>
                                <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                                    {t("provider.tours.actions")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {visibleTours?.length > 0 ? (
                                visibleTours.map((tour) => {
                                    const bookingStatus = getBookingStatusBadge(tour.bookingStatus);

                                    return (
                                    <TableRow key={tour._id} className="group">
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
                                                        {tour.location || t("provider.tours.noLocation")}
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
                                                    <p>{t("provider.tours.child")}: {formatPrice(tour.price?.child || 0)} đ</p>
                                                    <p>{t("provider.tours.infant")}: {formatPrice(tour.price?.infant || 0)} đ</p>
                                                </div>

                                                <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">
                                                    {t("provider.tours.perPerson")}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-5">
                                            <Badge
                                                className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em]
                                                          ${bookingStatus.className}
                                                        `}
                                            >
                                                {t(`provider.tours.statuses.${bookingStatus.labelKey}`)}
                                            </Badge>
                                            <p className="mt-2 text-xs text-on-surface-variant">
                                                {t("provider.tours.bookings", { count: tour.bookingCount || 0 })}
                                            </p>
                                        </TableCell>
                                        <TableCell className="px-6 py-5">
                                            <p className="font-headline text-base font-extrabold text-on-surface">
                                                {formatCurrencyVND(tour.revenue || 0)}
                                            </p>
                                            <p className="mt-1 text-xs text-on-surface-variant">
                                                {t("provider.tours.paidBookings", { count: tour.paidBookingCount || 0 })}
                                            </p>
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
                                                            {t("provider.tours.manageSchedule")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>{t("provider.tours.duplicateTour")}</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => handleDelete(tour)}
                                                        >
                                                            {t("provider.tours.archiveTour")}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center text-on-surface-variant">
                                        {t("provider.tours.noTours")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <PaginationBar
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    previousLabel={t("common.previous")}
                    nextLabel={t("common.next")}
                    summary={t("provider.tours.showing", {
                        first: firstRow,
                        last: lastRow,
                        total: filteredTours.length,
                    })}
                    className="rounded-[1.5rem] bg-surface-container-low"
                />
            </CardContent>
        </Card>
    );
}
