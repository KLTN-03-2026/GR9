import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PageHero from "@/components/shared/page-hero";
import { getAllTours } from "@/services/api/guest";
import { formatPrice } from "@/utils/formatPrice";
import TourListSkeleton from "./TourListSkeleton";
import { useI18n } from "@/i18n/I18nProvider";

const PAGE_SIZE = 9;
const SORT_OPTIONS = [
    { value: "popular", label: "Phổ biến" },
    { value: "topRated", label: "Đánh giá cao" },
    { value: "mostBooked", label: "Nhiều người đặt" },
    { value: "priceLow", label: "Giá tốt nhất" },
    { value: "durationShort", label: "Ngắn ngày" },
];

const SORT_LABEL_KEYS = {
    popular: "popular",
    topRated: "topRated",
    mostBooked: "mostBooked",
    priceLow: "priceLow",
    durationShort: "durationShort",
};

const getTourImage = (tour) =>
    tour?.images?.imageUrl ||
    tour?.images?.[0]?.imageUrl ||
    tour?.coverImage ||
    tour?.image ||
    null;

export default function TourList() {
    const { t } = useI18n();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("popular");
    const [tours, setTours] = useState([]);
    const [page, setPage] = useState(1);
    const [totalTours, setTotalTours] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const pageTopRef = useRef(null);
    const skipPageScrollRef = useRef(true);

    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        setSearch((current) => (current === urlSearch ? current : urlSearch));
    }, [searchParams]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
            setSearchParams(
                (current) => {
                    const next = new URLSearchParams(current);
                    if (search.trim()) {
                        next.set("search", search.trim());
                    } else {
                        next.delete("search");
                    }
                    return next;
                },
                { replace: true },
            );
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
                    limit: PAGE_SIZE,
                    search: debouncedSearch,
                    sort: sortBy,
                });

                const payload = res.data.data;
                setTours(payload.docs || payload || []);
                setTotalTours(payload.total || 0);
                setTotalPages(payload.totalPages || 1);
            } catch {
                setError(t("tourList.loadError"));
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [page, sortBy, debouncedSearch, t]);

    useEffect(() => {
        if (skipPageScrollRef.current) {
            skipPageScrollRef.current = false;
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            if (pageTopRef.current) {
                pageTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }

            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [page, sortBy, debouncedSearch]);

    const filteredTours = useMemo(() => tours, [tours]);
    const paginationPages = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);
    const firstItem = totalTours === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const lastItem = Math.min(page * PAGE_SIZE, totalTours);

    return (
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
            <div ref={pageTopRef} className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-4 pb-10 pt-6 sm:px-6 md:px-10 md:pt-24">
                <PageHero
                    className="mb-12"
                    contentClassName="xl:items-center"
                    eyebrow={t("tourList.eyebrow")}
                    heading={
                        <>
                            {t("tourList.headingA")}{" "}
                            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                                {t("tourList.headingB")}
                            </span>
                        </>
                    }
                    description={t("tourList.description")}
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
                                <Select
                                    value={sortBy}
                                    onValueChange={(value) => {
                                        setSortBy(value);
                                        setPage(1);
                                    }}
                                >
                                    <SelectTrigger className="h-11 w-full rounded-full border-outline-variant/20 bg-white/95 px-4 text-slate-900 shadow-sm sm:w-[220px]">
                                        <SelectValue placeholder="Sắp xếp tour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {t(`tourList.sort.${SORT_LABEL_KEYS[option.value]}`)}
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
                                className="group relative overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
                                    {getTourImage(tour) ? (
                                        <img
                                            alt={tour.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            src={getTourImage(tour)}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                            <span className="material-symbols-outlined text-6xl">
                                                travel_explore
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md">
                                            {tour.numberOfDay
                                                ? `${tour.numberOfDay} ${t("common.day")}`
                                                : t("common.flexible")}
                                        </span>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16">
                                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-white/90">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            {tour.location}
                                        </div>
                                        <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-white">
                                            {tour.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-5 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Từ
                                            </p>
                                            <span className="text-2xl font-extrabold text-primary">
                                                {Number(tour?.price?.adult) > 0
                                                    ? `${formatPrice(tour?.price?.adult)}đ`
                                                    : t("common.contact")}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500"> / người lớn</span>
                                        </div>

                                        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right dark:bg-amber-400/10">
                                            <div className="flex items-center justify-end gap-1">
                                                <span
                                                    className="material-symbols-outlined text-sm text-amber-500"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span className="text-sm font-extrabold text-slate-900">
                                                    {Number(tour.averageRating) > 0 ? tour.averageRating : "Mới"}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                                                {tour.reviewCount || 0} đánh giá
                                            </p>
                                        </div>
                                    </div>

                                    {tour.description && (
                                        <p className="line-clamp-2 min-h-[48px] text-sm leading-6 text-on-surface-variant">
                                            {tour.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-low text-on-surface-variant sm:grid-cols-3">
                                        <div className="flex min-h-[64px] flex-col items-center justify-center gap-1 border-b border-outline-variant/15 px-2 text-center sm:min-h-[72px] sm:border-b-0 sm:border-r">
                                            <span className="material-symbols-outlined text-[20px] leading-none text-primary">
                                                schedule
                                            </span>
                                            <span className="block h-4 whitespace-nowrap text-xs font-bold leading-4 text-slate-900">
                                                {tour.numberOfDay || "-"} ngày
                                            </span>
                                        </div>
                                        <div className="flex min-h-[64px] flex-col items-center justify-center gap-1 border-b border-outline-variant/15 px-2 text-center sm:min-h-[72px] sm:border-b-0 sm:border-r">
                                            <span className="material-symbols-outlined text-[20px] leading-none text-primary">
                                                groups
                                            </span>
                                            <span className="block h-4 whitespace-nowrap text-xs font-bold leading-4 text-slate-900">
                                                {tour.travelerCount || 0} khách
                                            </span>
                                        </div>
                                        <div className="flex min-h-[64px] flex-col items-center justify-center gap-1 px-2 text-center sm:min-h-[72px]">
                                            <span className="material-symbols-outlined text-[20px] leading-none text-primary">
                                                confirmation_number
                                            </span>
                                            <span className="block h-4 whitespace-nowrap text-xs font-bold leading-4 text-slate-900">
                                                {tour.bookingCount || 0} lượt
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        className="h-11 w-full rounded-xl bg-primary font-bold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
                                    >
                                        <Link to={`/traveler/tour-detail/${tour._id}`}>{t("common.viewDetails")}</Link>
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && (
                    <article className="mt-8 flex flex-col gap-6 overflow-hidden rounded-xl bg-primary-container p-5 text-on-primary-container shadow-lg sm:p-8 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="material-symbols-outlined mb-4 text-5xl">auto_awesome</span>
                            <h3 className="mb-3 text-2xl font-extrabold leading-tight">{t("tourList.customTitle")}</h3>
                            <p className="max-w-2xl text-sm leading-relaxed text-on-primary-container/80">
                                {t("tourList.customDescription")}
                            </p>
                        </div>
                        <Button
                            asChild
                            className="w-full rounded-xl bg-white px-6 py-3 font-bold text-primary transition-all hover:-translate-y-1 hover:shadow-xl md:w-auto"
                        >
                            <Link to="/traveler/ai-travel-planner">{t("tourList.customButton")}</Link>
                        </Button>
                    </article>
                )}

                {/* Pagination */}
                <div className="mt-12 flex flex-col items-center gap-6">
                    <p className="text-sm font-semibold text-on-surface-variant">
                        {t("tourList.showing", { first: firstItem, last: lastItem, total: totalTours })}
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-lg px-4 font-bold"
                            onClick={() => setPage((current) => Math.max(current - 1, 1))}
                            disabled={page <= 1}
                        >
                            {t("common.previous")}
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
                            {t("common.next")}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
