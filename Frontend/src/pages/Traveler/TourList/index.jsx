import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PageHero from "@/components/shared/page-hero";
import { getAllTours } from "@/services/api/guest";
import { formatPrice } from "@/utils/formatPrice";
import TourListSkeleton from "./TourListSkeleton";

const PAGE_SIZE_OPTIONS = [9, 6];

export default function TourList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
    const [tours, setTours] = useState([]);
    const [page, setPage] = useState(1);
    const [totalTours, setTotalTours] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        setSearch((current) => (current === urlSearch ? current : urlSearch));
    }, [searchParams]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
            setSearchParams((current) => {
                const next = new URLSearchParams(current);
                if (search.trim()) {
                    next.set("search", search.trim());
                } else {
                    next.delete("search");
                }
                return next;
            }, { replace: true });
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, setSearchParams]);
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getAllTours({
                    page,
                    limit: pageSize,
                    search: debouncedSearch,
                    sort: sortBy,
                });

                const payload = res.data.data;
                setTours(payload.docs || payload || []);
                setTotalTours(payload.total || 0);
                setTotalPages(payload.totalPages || 1);
            } catch (err) {
                setError("Failed to load tours");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [page, pageSize, sortBy, debouncedSearch]);
    const filteredTours = useMemo(() => tours, [tours]);
    const paginationPages = useMemo(
        () => Array.from({ length: totalPages }, (_, index) => index + 1),
        [totalPages],
    );
    const firstItem = totalTours === 0 ? 0 : (page - 1) * pageSize + 1;
    const lastItem = Math.min(page * pageSize, totalTours);

    return (
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
            <div className="mx-auto w-full max-w-[1600px] px-6 pb-12 pt-24 md:px-10">
                <PageHero
                    className="mb-12"
                    contentClassName="xl:items-center"
                    eyebrow="Traveler Collection"
                    heading={
                        <>
                            Curated <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">Tours</span>
                        </>
                    }
                    description="Discover handcrafted experiences designed by our travel experts and AI planning engine."
                    rightSlot={
                        <div className="flex w-full max-w-2xl flex-col gap-3 xl:items-end">
                            <div className="w-full md:w-[360px]">
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search tours..."
                                    className="h-11 rounded-full border-outline-variant/20 bg-white/95 text-slate-900 placeholder:text-slate-500"
                                />
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                <span className="text-sm font-medium text-on-surface-variant">Sort by:</span>
                                <Select
                                    value={sortBy}
                                    onValueChange={(value) => {
                                        setSortBy(value);
                                        setPage(1);
                                    }}
                                >
                                    <SelectTrigger className="h-auto w-full rounded-xl bg-white px-4 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-outline-variant/10 sm:w-[280px]">
                                        <SelectValue placeholder="Most Popular" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="ratingHigh">Top Rated</SelectItem>
                                        <SelectItem value="priceLow">Price: Low to High</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={String(pageSize)}
                                    onValueChange={(value) => {
                                        setPageSize(Number(value));
                                        setPage(1);
                                    }}
                                >
                                    <SelectTrigger className="h-auto w-full rounded-xl bg-white px-4 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-outline-variant/10 sm:w-[150px]">
                                        <SelectValue placeholder="9 / page" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAGE_SIZE_OPTIONS.map((option) => (
                                            <SelectItem key={option} value={String(option)}>
                                                {option} / page
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    }
                />

                {error && <div className="text-center text-red-500 font-semibold py-8">{error}</div>}
                {loading ? (
                    <TourListSkeleton />
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {filteredTours.map((tour) => (
                            <article
                                key={tour._id}
                                className="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="aspect-[4/5] overflow-hidden relative">
                                    <img
                                        alt={tour.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        src={tour.images?.imageUrl || tour.images?.[0]?.imageUrl || "/default-tour.jpg"}
                                    />

                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-on-surface text-xs font-bold rounded-full">
                                            {tour.type || "Tour"}
                                        </span>
                                    </div>

                                    <button
                                        className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-error transition-colors"
                                        type="button"
                                        aria-label={`Favorite ${tour.name}`}
                                    >
                                        <span className="material-symbols-outlined">favorite</span>
                                    </button>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex items-center gap-2 text-white/90 text-xs font-medium mb-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            {tour.location}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{tour.name}</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <span className="text-2xl font-extrabold text-primary">
                                                {formatPrice(tour?.price?.adult)
                                                    ? `${formatPrice(tour?.price?.adult)}đ`
                                                    : "Contact"}
                                            </span>
                                            <span className="text-xs text-on-surface-variant">/ person</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <span
                                                className="material-symbols-outlined text-amber-500 text-sm"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                star
                                            </span>
                                            <span className="text-sm font-bold">{tour.rating || "-"}</span>
                                            <span className="text-xs text-on-surface-variant">
                                                ({tour.reviews || 0})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-8 text-on-surface-variant">
                                        <div className="flex items-center gap-1.5 text-xs font-medium">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            {tour.numberOfDay ? `${tour.numberOfDay} Days` : "-"}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium">
                                            <span className="material-symbols-outlined text-sm">group</span>
                                            {tour.group || "-"}
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        className="w-full py-3 bg-secondary-container text-on-secondary-container font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all active:scale-95"
                                    >
                                        <Link to={`/traveler/tour-detail/${tour._id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && (
                    <article className="mt-8 flex flex-col gap-6 overflow-hidden rounded-xl bg-primary-container p-8 text-on-primary-container shadow-lg md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="material-symbols-outlined mb-4 text-5xl">auto_awesome</span>
                            <h3 className="mb-3 text-2xl font-extrabold leading-tight">
                                Can't find your perfect match?
                            </h3>
                            <p className="max-w-2xl text-sm leading-relaxed text-on-primary-container/80">
                                Let our AI Concierge design a bespoke itinerary based on your unique travel style,
                                interests, and budget.
                            </p>
                        </div>
                        <Button
                            asChild
                            className="w-full rounded-xl bg-white px-6 py-3 font-bold text-primary transition-all hover:-translate-y-1 hover:shadow-xl md:w-auto"
                        >
                            <Link to="/traveler/ai-travel-planner">Build Custom Trip</Link>
                        </Button>
                    </article>
                )}

                {/* Pagination */}
                <div className="mt-12 flex flex-col items-center gap-6">
                    <p className="text-sm font-semibold text-on-surface-variant">
                        Showing {firstItem}-{lastItem} of {totalTours} tours
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-lg px-4 font-bold"
                            onClick={() => setPage((current) => Math.max(current - 1, 1))}
                            disabled={page <= 1}
                        >
                            Previous
                        </Button>

                        {paginationPages.map((pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`h-10 w-10 flex items-center justify-center rounded-lg font-bold ${
                                    page === pageNumber
                                        ? "bg-primary text-on-primary"
                                        : "hover:bg-surface-container text-on-surface font-semibold"
                                }`}
                                type="button"
                                onClick={() => setPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-lg px-4 font-bold"
                            onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                            disabled={page >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
