import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PageHero from "@/components/shared/page-hero";
import { getAllTours } from "@/services/api/guest";
import { formatPrice } from "@/utils/formatPrice";
import TourListSkeleton from "./TourListSkeleton";

const PAGE_SIZE = 6;

export default function TourList() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [tours, setTours] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getAllTours({
                    page,
                    limit: PAGE_SIZE,
                    search: debouncedSearch,
                    sort: sortBy,
                });

                setTours(res.data.data.docs || res.data.data || []);
                setTotalPages(res.data.data.totalPages || 1);
            } catch (err) {
                setError("Failed to load tours");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [page, sortBy, debouncedSearch]);
    const filteredTours = useMemo(() => tours, [tours]);

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
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="h-auto w-full rounded-xl bg-white px-4 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-outline-variant/10 sm:w-[280px]">
                                        <SelectValue placeholder="Most Popular" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="ratingHigh">Top Rated</SelectItem>
                                        <SelectItem value="priceLow">Price: Low to High</SelectItem>
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
                                        src={tour.images.imageUrl || tour.images?.[0]?.imageUrl || "/default-tour.jpg"}
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

                        {/* AI Plan Card */}
                        <article className="group relative bg-primary-container rounded-xl overflow-hidden shadow-lg p-8 flex flex-col justify-center text-on-primary-container">
                            <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <span className="material-symbols-outlined text-5xl mb-6">auto_awesome</span>
                                <h3 className="text-2xl font-extrabold mb-4 leading-tight">
                                    Can't find your perfect match?
                                </h3>
                                <p className="text-on-primary-container/80 text-sm mb-8 leading-relaxed">
                                    Let our AI Concierge design a bespoke itinerary based on your unique travel style,
                                    interests, and budget.
                                </p>
                                <Button
                                    asChild
                                    className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    <Link to="/traveler/ai-plan">Build Custom Trip</Link>
                                </Button>
                            </div>
                        </article>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-20 flex flex-col items-center gap-6">
                    <Button
                        className="px-10 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-outline-variant/20 transition-colors"
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page >= totalPages}
                    >
                        Show More Adventures
                    </Button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`h-10 w-10 flex items-center justify-center rounded-lg font-bold ${
                                    page === i + 1
                                        ? "bg-primary text-on-primary"
                                        : "hover:bg-surface-container text-on-surface font-semibold"
                                }`}
                                type="button"
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
