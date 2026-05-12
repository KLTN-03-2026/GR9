import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getTourById } from "@/services/api/guest";
import { formatPrice } from "@/utils/formatPrice";
import { formatDateISO, formatDateDisplay } from "@/utils/date";
import TourDetailSkeleton from "./TourDetailSkeleton";
import { createBooking } from "@/services/api/booking";
import { getReviewsByTour } from "@/services/api/review";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { useI18n } from "@/i18n/I18nProvider";

const FEATURE_CARDS = [
    { icon: "temple_buddhist", titleKey: "tourDetail.featureHeritage" },
    { icon: "light", titleKey: "tourDetail.featureWorkshop" },
    { icon: "restaurant", titleKey: "tourDetail.featureTasting" },
    { icon: "camera_alt", titleKey: "tourDetail.featurePhotoStops" },
];

const REVIEW_TAG_KEYS = [
    "tourDetail.tagSmooth",
    "tourDetail.tagGuide",
    "tourDetail.tagPacing",
];

const MEMORY_CARDS = [
    {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwLBQIZXRDx742QLoG_dba4D1f21uAFp7L8FwjkEGihhEOIj5w5PRb2LHn1iyGq6QHdbdfdi3E70Iv-a0bOpKmvjPlxp2EfiY2cSxYSersnRn8zeb-p0o8W4tGzCoSjIki5bVSqiySFVdfO4XrcXipkZxeJhCBfF3dKE8gdoKOPhfLMpbbM6kxUntNQ7y9lp5CfD8ZE8RvcGcsORLXPSe1sZhoG_r5eLjay-77d5mV_bYsa7P-lpO340ehMKJbVbFRWCdB9xB0qpyy",
        by: "Maria S.",
        alt: "Golden Bridge",
    },
    {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOcqjHijMLIZdVzszftnSS2LbhvfcFlVO0OkDy1fQ0CVJlydfDAace9fTGyCAoa8QXY3qVzoukfVvLJrjohS0oH8gGqAxeRAxELBCbUb30oqhok7lMQHk7YIZeyUgCTqij8f2S17NK0Mje5sLUQsF5CZ6b1E2tDdyPe4R_cxGvCmnW4n9DIG9p8z9Qni9DZ1tDd7vFKR0WMuL3pCVIfGf-CfcbHK35V2libMuk21FVKQIenUjGgQaL1PVs8tLDSyu40pR9Dr9bn9L4",
        by: "James L.",
        alt: "Cable car",
    },
    {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMVHGMQqvqjPshagiYXLfkg7Dep66GERX8sHF3_8rW3FcEr069XBOr1MViFw4W6FZNtlehK4KWTIV_XFXkX8E2eudvYyeloLkxPNw6XgLWrpyAtIPOkc-vp5sE-ngvmT3UEwMRYqTpboG310j3s6rm9_2XH_qQVlfs2FF6i3NzpE4ZSjxKsQUzhCr5CT3TMhkMH9by2yJGNykSwcW_tV2s--mn1ufTqIKnHsUZhcm6Xz0tcituebybSr_BYH5jId4iakpLGE24oStH",
        by: "Yuki T.",
        alt: "Pagoda",
    },
    {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAKle9HDMEfUnV8n9M_Tmy0v9AKwK8cuIUXUlYH6qSTh77eMZpVz-w2t7XGzyFJftJN9y8JMxJ8fnLZ4xshzRPXKNEOMa9sbmC3Sr53xTxdw1fRThUt1cFVj2_gszGIsdABC2kQyqOTWDLyDnEAtB-V99ukyvaYXM_cMotpQcOolJIz2DwRG7GExRz2zceZ2zF2_WPL3WamDjqwtlqhRzPan_bJRXAIz_Y_2TOZ4VXYENa9iVTPNzys7EidjsE86vF40GrmiqDcIn6",
        by: "Olivia R.",
        alt: "French village",
    },
];

const getServicePrice = (service, type) =>
    service?.total?.find((item) => item.type === type)?.price || 0;

const toServiceOption = (item) => {
    const service = item.serviceId;

    return {
        id: service?._id,
        label: service?.name,
        description: service?.description,
        adultPrice: getServicePrice(service, "ADULT"),
        childPrice: getServicePrice(service, "CHILD"),
        infantPrice: getServicePrice(service, "INFANT"),
        isDefault: item.isDefault,
    };
};

const getInitialTravelerCounts = (tour) => {
    const quantity = tour?.sourceAiTourRequestId?.quantity;
    if (!quantity) {
        return { adults: 2, children: 0, infants: 0 };
    }

    const adults = Number(quantity.ADULT ?? quantity.adult);
    const children = Number(quantity.CHILD ?? quantity.child);
    const infants = Number(quantity.INFANT ?? quantity.infant);
    const total = (adults || 0) + (children || 0) + (infants || 0);

    if (total <= 0) {
        return { adults: 2, children: 0, infants: 0 };
    }

    return {
        adults: Math.max(0, adults || 0),
        children: Math.max(0, children || 0),
        infants: Math.max(0, infants || 0),
    };
};

export default function TourDetail() {
    const { tourId } = useParams();
    const { language, t } = useI18n();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookingSubmitting, setBookingSubmitting] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [reviews, setReviews] = useState([]);
    const resetBooking = () => {
        setSelectedDate("");
        setSelectedScheduleId(null);
        setAdults(2);
        setChildren(0);
        setInfants(0);
        setRoomCount(1);
        setIsPrivate(false);
    };
    useEffect(() => {
        if (!tourId) return;
        setLoading(true);
        setError("");
        getTourById(tourId)
            .then((res) => {
                setTour(res.data.data || null);
            })
            .catch(() => {
                setError(t("tourDetail.loadError"));
            })
            .finally(() => setLoading(false));
    }, [tourId, t]);
    useEffect(() => {
        if (!tourId) return;

        getReviewsByTour(tourId)
            .then((res) => {
                setReviews(res.data.data || []);
            })
            .catch(() => {
                setReviews([]);
            });
    }, [tourId]);

    const basePrice = useMemo(() => Number(tour?.price?.adult) || 0, [tour]);
    const childPrice = Number(tour?.price?.child) || 0;
    const infantPrice = Number(tour?.price?.infant) || 0;
    const privateMultiplier = Number(tour?.privateMultiplier) || 1.5;
    const [selectedDate, setSelectedDate] = useState("");
    const [dateDialogOpen, setDateDialogOpen] = useState(false);
    const [hotelPref, setHotelPref] = useState("no-over-night");
    const [transportPref, setTransportPref] = useState("shared-shuttle");
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [roomCount, setRoomCount] = useState(1);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const isLockedPrivate = tour?.bookingAccess === "TARGET_TRAVELER_ONLY";
    const bookingDisabledReason = useMemo(() => {
        if (!isLockedPrivate) return "";
        if (tour?.travelerApprovalStatus === "PENDING") {
            return t("tourDetail.pendingApprovalHint");
        }
        if (tour?.travelerApprovalStatus === "REJECTED" || tour?.isActive === false) {
            return t("tourDetail.unavailableHint");
        }
        return "";
    }, [isLockedPrivate, tour, t]);
    const filteredSchedules = useMemo(() => {
        if (!tour?.schedules) return [];

        if (isLockedPrivate) {
            return tour.schedules;
        }

        return tour.schedules.filter((s) => s.isPrivate === isPrivate);
    }, [tour, isLockedPrivate, isPrivate]);
    useEffect(() => {
        setSelectedScheduleId(null);
        setSelectedDate("");
    }, [isPrivate]);
    const handleBooking = async () => {
        if (bookingSubmitting) return;
        if (!tour?._id && !tourId) {
            toast.error("Không tìm thấy tour để đặt.");
            return;
        }
        if (!Number.isInteger(Number(adults)) || Number(adults) < 1) {
            toast.error("Vui lòng chọn ít nhất 1 người lớn.");
            return;
        }
        if (Number(children) < 0 || Number(infants) < 0) {
            toast.error("Số lượng trẻ em hoặc em bé không hợp lệ.");
            return;
        }
        if (!selectedScheduleId || !selectedDate) {
            toast.error(t("tourDetail.chooseDateToast"));
            return;
        }
        if (Number(total) < 0 || !Number.isFinite(Number(total))) {
            toast.error("Tổng tiền booking không hợp lệ.");
            return;
        }

        try {
            setBookingSubmitting(true);
            const payload = {
                tourId: tour?._id || tourId,
                tourScheduleId: selectedScheduleId,
                quantity: {
                    adults,
                    children,
                    infants,
                },
                totalAmount: total,
                isPrivate, 
                selectedServices,
                startDate: selectedDate,
            };

            const response = await createBooking(payload);
            const checkoutUrl = response.data.data?.payment?.checkoutUrl;

            toast.success(t("tourDetail.bookingSuccess"));
            resetBooking();

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || t("tourDetail.bookingFailed"));
        } finally {
            setBookingSubmitting(false);
        }
    };
    const hotelOptions = useMemo(() => {
        return (
            tour?.availableServices
                ?.filter((s) => s.type === "HOTEL")
                ?.sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
                ?.map(toServiceOption) || []
        );
    }, [tour]);
    const transportOptions = useMemo(() => {
        return (
            tour?.availableServices
                ?.filter((s) => s.type === "TRANSPORT")
                ?.sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
                ?.map(toServiceOption) || []
        );
    }, [tour]);
    useEffect(() => {
        if (!tour) return;

        const defaultHotel = tour.availableServices?.find((s) => s.type === "HOTEL" && s.isDefault);

        const defaultTransport = tour.availableServices?.find((s) => s.type === "TRANSPORT" && s.isDefault);

        if (defaultHotel) {
            setHotelPref(defaultHotel.serviceId?._id || defaultHotel.serviceId);
        }

        if (defaultTransport) {
            setTransportPref(defaultTransport.serviceId?._id || defaultTransport.serviceId);
        }

        const initialTravelers = getInitialTravelerCounts(tour);
        setAdults(initialTravelers.adults);
        setChildren(initialTravelers.children);
        setInfants(initialTravelers.infants);
        setIsPrivate(tour?.bookingAccess === "TARGET_TRAVELER_ONLY");

        setSelectedScheduleId(null);
        setSelectedDate("");
    }, [tour]);

    const nights = Math.max((Number(tour?.numberOfDay) || 1) - 1, 0);
    const selectedHotel = hotelOptions.find((h) => h.id === hotelPref);
    const selectedTransport = transportOptions.find((t) => t.id === transportPref);
    const hotelUnitPrice = selectedHotel?.adultPrice || 0;
    const transportTotal = selectedTransport?.adultPrice || 0;
    const hotelTotal = selectedHotel ? roomCount * nights * hotelUnitPrice : 0;
    const basePeopleTotal = adults * basePrice + children * childPrice + infants * infantPrice;
    const baseTourTotal = isPrivate ? Math.round(basePeopleTotal * privateMultiplier) : basePeopleTotal;
    const total = baseTourTotal + hotelTotal + transportTotal;
    const displayedGuide = useMemo(() => {
        const selectedSchedule = filteredSchedules.find((schedule) => schedule._id === selectedScheduleId);
        return (
            selectedSchedule?.leadGuideServiceId ||
            filteredSchedules.find((schedule) => schedule?.leadGuideServiceId)?.leadGuideServiceId ||
            tour?.primaryGuide ||
            null
        );
    }, [filteredSchedules, selectedScheduleId, tour]);
    const reviewCount = reviews.length;
    const averageTourRating =
        reviewCount > 0
            ? (
                  reviews.reduce((sum, review) => sum + (Number(review.ratingTour) || 0), 0) /
                  reviewCount
              ).toFixed(1)
            : tour?.rating || 0;
    const selectedServices = [
        {
            serviceType: "HOTEL",
            serviceId: selectedHotel?.id,
            optionName: selectedHotel?.label,
            price: hotelTotal,
            isIncluded: false,
            quantity: roomCount,
            nights,
            unitPrice: hotelUnitPrice,
        },
        {
            serviceType: "TRANSPORT",
            serviceId: selectedTransport?.id,
            optionName: selectedTransport?.label,
            price: transportTotal,
            isIncluded: false,
            quantity: selectedTransport ? 1 : 0,
            nights: 0,
            unitPrice: transportTotal,
        },
    ];
    if (loading) {
        return <TourDetailSkeleton />;
    }
    const getRemaining = (s) => {
        if (!s.maxSlots) return "∞";
        return s.maxSlots - (s.currentBooked || 0);
    };
    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <Button
                    onClick={() => {
                        setLoading(true);
                        setError("");
                        getTourById(tourId)
                            .then((res) => {
                                setTour(res.data.data || null);
                            })
                            .catch(() => {
                                setError(t("tourDetail.loadError"));
                            })
                            .finally(() => setLoading(false));
                    }}
                    className="mt-4"
                >
                    {t("tourDetail.retry")}
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-surface font-body text-on-surface">
            <style>
                {`
     .material-symbols-outlined { font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24; vertical-align: middle; }
     .editorial-gradient { background: linear-gradient(135deg, #00685f 0%, #008378 100%); }
     .hero-scrim { background: linear-gradient(to bottom, rgba(25, 28, 30, 0.4) 0%, rgba(25, 28, 30, 0) 30%, rgba(25, 28, 30, 0) 70%, rgba(25, 28, 30, 0.8) 100%); }
     .hide-scrollbar::-webkit-scrollbar { display: none; }
     .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
     `}
            </style>

            <main className="min-h-screen pt-4 sm:pt-8 md:pt-16">
                <section className="relative h-[520px] w-full overflow-hidden rounded-3xl sm:h-[640px] md:h-[716px] md:rounded-none">
                    <img src={tour?.images?.[0]?.imageUrl} alt={tour?.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 hero-scrim" />

                    <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 md:p-16">
                        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-fixed text-xs font-semibold tracking-wide uppercase">
                                    <span
                                        className="material-symbols-outlined text-sm"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                    >
                                        auto_awesome
                                    </span>
                                    {t("tourDetail.aiRecommended")}
                                </div>
                                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
                                    {tour?.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-white/90 sm:gap-4 sm:text-base">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-primary-fixed">
                                            location_on
                                        </span>
                                        {tour?.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-primary-fixed">schedule</span>
                                        {tour?.numberOfDay} {t("common.day")}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-primary-fixed">star</span>
                                        {averageTourRating || 4.8} ({t("tourDetail.reviewCount", { count: reviewCount || tour?.reviews || 0 })})
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md sm:p-6">
                                <p className="text-sm opacity-80 mb-1 font-medium">{t("tourDetail.startingFrom")}</p>
                                <p className="text-2xl font-bold sm:text-3xl">
                                    {formatPrice(basePrice)}
                                    <span className="text-lg font-normal opacity-80">{t("tourDetail.perPerson")}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 md:px-12 lg:py-20">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                        <div className="space-y-10 lg:col-span-8 lg:space-y-16">
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-on-surface sm:text-3xl">
                                    {t("tourDetail.overview")}
                                </h2>
                                <p className="max-w-3xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                                    {tour?.description || t("tourDetail.overviewFallback", { location: tour?.location || "" })}
                                </p>
                                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
                                    {FEATURE_CARDS.map((c) => (
                                        <div
                                            key={c.titleKey}
                                            className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-low p-4 text-center sm:p-6"
                                        >
                                            <span className="material-symbols-outlined text-primary text-3xl">
                                                {c.icon}
                                            </span>
                                            <span className="font-bold text-on-surface text-sm">{t(c.titleKey)}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-8">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="text-2xl font-bold text-on-surface sm:text-3xl">
                                        {t("tourDetail.timeline")}
                                    </h2>
                                    <Link
                                        to="/traveler/tour-list"
                                        className="text-primary font-bold text-sm hover:underline"
                                    >
                                        {t("tourDetail.backToTours")}
                                    </Link>
                                </div>

                                <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 before:w-[2px] before:bg-outline-variant/30">
                                    {tour?.itineraries?.map((day, index) => (
                                        <div key={day._id} className="relative pl-12">
                                            {/* Circle */}
                                            <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs ring-4 ring-surface">
                                                {index + 1}
                                            </div>

                                            {/* Title (giữ style cũ) */}
                                            <h3 className="text-xl font-bold font-headline mb-2">
                                                {t("tourDetail.day", { day: day.dayNumber })}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-on-surface-variant mb-4">
                                                {day.description || t("tourDetail.noDescription")}
                                            </p>

                                            {/* Activities */}
                                            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                                                {day.activities?.length > 0 ? (
                                                    day.activities.map((it) => (
                                                        <div
                                                            key={it._id}
                                                            className="p-4 rounded-xl bg-surface-container-low"
                                                        >
                                                            <p className="font-bold text-xs text-primary mb-1 uppercase tracking-wider">
                                                                {it.time || "--:--"}
                                                            </p>

                                                            <p className="text-sm">
                                                                {it.serviceId?.name || t("tourDetail.noService")}
                                                            </p>

                                                            <p className="text-xs text-on-surface-variant mt-1">
                                                                {tour?.location}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-on-surface-variant italic">
                                                        {t("tourDetail.noActivities")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6 rounded-3xl bg-secondary-container/30 p-5 sm:p-8">
                                <h2 className="text-xl font-bold text-on-surface sm:text-2xl">{t("tourDetail.includedServices")}</h2>
                                <div className="grid gap-5 md:grid-cols-2 md:gap-8">
                                    <div className="flex gap-4">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        <div>
                                            <p className="font-bold text-on-surface">{t("tourDetail.privateTransfer")}</p>
                                            <p className="text-sm text-on-surface-variant">
                                                {t("tourDetail.privateTransferText")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        <div>
                                            <p className="font-bold text-on-surface">{t("tourDetail.guideSupport")}</p>
                                            <p className="text-sm text-on-surface-variant">
                                                {t("tourDetail.guideSupportText")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="space-y-6 lg:sticky lg:top-24">
                                <div className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-2xl shadow-on-surface/5 sm:p-8">
                                    <h3 className="text-2xl font-bold font-headline mb-6">{t("tourDetail.bookExperience")}</h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                                                {t("tourDetail.departureDate")}
                                            </label>

                                            <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <button
                                                        className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 w-full"
                                                        type="button"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-on-surface-variant">
                                                                calendar_today
                                                            </span>
                                                            <span
                                                                className={`font-medium ${
                                                                    selectedDate
                                                                        ? "text-on-surface"
                                                                        : "text-on-surface-variant"
                                                                }`}
                                                            >
                                                                {selectedDate
                                                                    ? formatDateDisplay(selectedDate, language === "vi" ? "vi-VN" : "en-US")
                                                                    : t("tourDetail.chooseDepartureDate")}
                                                            </span>
                                                        </div>
                                                        <span className="material-symbols-outlined text-on-surface-variant">
                                                            expand_more
                                                        </span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-surface-container-lowest text-on-surface sm:max-w-[420px]">
                                                    <div className="space-y-3">
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-bold text-on-surface-variant">
                                                                {t("tourDetail.chooseAvailableSchedule")}
                                                            </p>
                                                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                                                {filteredSchedules.length > 0 ? (
                                                                    filteredSchedules.map((s) => {
                                                                        const isSelected =
                                                                            formatDateISO(s.departureDate) ===
                                                                            selectedDate;

                                                                        const remaining = getRemaining(s);

                                                                        return (
                                                                            <button
                                                                                key={s._id}
                                                                                disabled={s.status === "FULL"} // ✅ disable
                                                                                onClick={() => {
                                                                                    if (s.status === "FULL") return; // extra safety

                                                                                    setSelectedDate(
                                                                                        formatDateISO(s.departureDate),
                                                                                    );
                                                                                    setSelectedScheduleId(s._id);
                                                                                    setDateDialogOpen(false);
                                                                                }}
                                                                                className={`w-full text-left p-4 rounded-xl border transition ${
                                                                                    s.status === "FULL"
                                                                                        ? "cursor-not-allowed border-outline-variant/20 bg-surface-container-low opacity-60"
                                                                                        : isSelected
                                                                                          ? "border-primary bg-primary/5"
                                                                                          : "border-outline-variant/30 hover:bg-surface-container-low"
                                                                                }`}
                                                                            >
                                                                                <div className="flex justify-between items-center">
                                                                                    <div>
                                                                                        <p className="font-bold text-sm">
                                                                                            {formatDateDisplay(
                                                                                                s.departureDate,
                                                                                            )}
                                                                                        </p>

                                                                                        <p className="text-xs text-on-surface-variant">
                                                                                            {t("tourDetail.booked")}: {s.currentBooked} /{" "}
                                                                                            {s.maxSlots || "∞"}
                                                                                        </p>
                                                                                    </div>

                                                                                    {/* STATUS BADGE */}
                                                                                    <span
                                                                                        className={`text-xs px-2 py-1 rounded-full font-bold ${
                                                                                            s.status === "FULL"
                                                                                                ? "bg-red-100 text-red-600"
                                                                                                : s.status ===
                                                                                                    "CONFIRMED"
                                                                                                  ? "bg-green-100 text-green-600"
                                                                                                  : "bg-yellow-100 text-yellow-600"
                                                                                        }`}
                                                                                    >
                                                                                        {s.status}
                                                                                    </span>
                                                                                </div>

                                                                                <p className="text-xs mt-2 text-on-surface-variant">
                                                                                    {t("tourDetail.remaining")}: {remaining}
                                                                                </p>
                                                                            </button>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <p className="text-sm text-on-surface-variant">
                                                                        {t("tourDetail.noSchedules")}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                                                {t("tourDetail.travelers")}
                                            </label>

                                            <div className="space-y-3 p-3 rounded-xl border border-outline-variant/30">
                                                {/* Adults */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-sm">{t("tourDetail.adults")}</p>
                                                        <p className="text-xs text-on-surface-variant">
                                                            {formatPrice(basePrice)} {t("tourDetail.perPersonShort")}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setAdults((v) => Math.max(1, v - 1))}>
                                                            -
                                                        </button>
                                                        <span className="w-6 text-center">{adults}</span>
                                                        <button onClick={() => setAdults((v) => v + 1)}>+</button>
                                                    </div>
                                                </div>

                                                {/* Children */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-sm">{t("tourDetail.children")}</p>
                                                        <p className="text-xs text-on-surface-variant">
                                                            {formatPrice(childPrice)} {t("tourDetail.perPersonShort")}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setChildren((v) => Math.max(0, v - 1))}>
                                                            -
                                                        </button>
                                                        <span className="w-6 text-center">{children}</span>
                                                        <button onClick={() => setChildren((v) => v + 1)}>+</button>
                                                    </div>
                                                </div>

                                                {/* Infants */}
                                                <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-sm">{t("tourDetail.infants")}</p>
                                                    <p className="text-xs text-on-surface-variant">
                                                        {infantPrice > 0 ? `${formatPrice(infantPrice)} ${t("tourDetail.perPersonShort")}` : t("tourDetail.free")}
                                                    </p>
                                                </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setInfants((v) => Math.max(0, v - 1))}>
                                                            -
                                                        </button>
                                                        <span className="w-6 text-center">{infants}</span>
                                                        <button onClick={() => setInfants((v) => v + 1)}>+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                                                {t("tourDetail.hotelPreference", { nights })}
                                            </label>
                                            <div className="space-y-3">
                                                {hotelOptions.map((opt) => {
                                                    const selected = opt.id === hotelPref;
                                                    return (
                                                        <button
                                                            key={opt.id}
                                                            className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                                                                selected
                                                                    ? "border-primary bg-primary/5"
                                                                    : "border-outline-variant/30 hover:bg-surface-container-low"
                                                            }`}
                                                            type="button"
                                                            onClick={() => setHotelPref(opt.id)}
                                                        >
                                                            <div className="space-y-3">
                                                                <div className="space-y-2">
                                                                    <p className="text-base font-bold leading-snug text-on-surface break-words sm:text-lg">
                                                                        {opt.label}
                                                                    </p>
                                                                    <span
                                                                        className={`inline-flex max-w-full rounded-full px-3 py-1 text-xs font-bold leading-tight sm:text-sm ${
                                                                            selected
                                                                                ? "bg-primary/12 text-primary"
                                                                                : "bg-surface-container text-primary"
                                                                        }`}
                                                                    >
                                                                        {formatPrice(opt.adultPrice)}
                                                                        <span className="ml-1">
                                                                            {t("tourDetail.perRoomNight")}
                                                                        </span>
                                                                    </span>
                                                                    <p className="text-xs text-on-surface-variant">
                                                                        {opt.subtitle}
                                                                    </p>
                                                                    <p className="text-xs leading-relaxed text-on-surface-variant sm:text-sm">
                                                                        {opt.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {selectedHotel ? (
                                                <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="min-w-0">
                                                        <p className="text-base font-semibold">{t("tourDetail.rooms")}</p>
                                                        <p className="mt-1 text-sm text-on-surface-variant break-words">
                                                            {formatPrice(hotelUnitPrice)} x {t("tourDetail.nights", { nights })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-end gap-3 self-end sm:self-auto">
                                                        <button
                                                            type="button"
                                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/30 text-lg font-semibold transition-colors hover:bg-surface-container"
                                                            onClick={() => setRoomCount((value) => Math.max(1, value - 1))}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="min-w-8 text-center text-lg font-semibold">{roomCount}</span>
                                                        <button
                                                            type="button"
                                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/30 text-lg font-semibold transition-colors hover:bg-surface-container"
                                                            onClick={() => setRoomCount((value) => value + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                                                {t("tourDetail.transportPreference")}
                                            </label>
                                            <div className="space-y-3">
                                                {transportOptions.map((opt) => {
                                                    const selected = opt.id === transportPref;
                                                    return (
                                                        <button
                                                            key={opt.id}
                                                            className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                                                                selected
                                                                    ? "border-primary bg-primary/5"
                                                                    : "border-outline-variant/30 hover:bg-surface-container-low"
                                                            }`}
                                                            type="button"
                                                            onClick={() => setTransportPref(opt.id)}
                                                        >
                                                            <div className="space-y-3">
                                                                <div className="space-y-2">
                                                                    <p className="text-base font-bold leading-snug text-on-surface break-words sm:text-lg">
                                                                        {opt.label}
                                                                    </p>
                                                                    <span
                                                                        className={`inline-flex max-w-full rounded-full px-3 py-1 text-xs font-bold leading-tight sm:text-sm ${
                                                                            selected
                                                                                ? "bg-primary/12 text-primary"
                                                                                : "bg-surface-container text-primary"
                                                                        }`}
                                                                    >
                                                                        {formatPrice(opt.adultPrice)}
                                                                        <span className="ml-1">
                                                                            {t("tourDetail.perBooking")}
                                                                        </span>
                                                                    </span>
                                                                    <p className="text-xs text-on-surface-variant">
                                                                        {opt.subtitle}
                                                                    </p>
                                                                    <p className="text-xs leading-relaxed text-on-surface-variant sm:text-sm">
                                                                        {opt.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="pt-6 space-y-3 border-t border-outline-variant/20">
                                            <div className="flex items-start justify-between gap-4 text-on-surface-variant">
                                                <span className="min-w-0">{t("tourDetail.basePrice", { adults })}</span>
                                                <span className="shrink-0 text-right">{formatPrice(basePrice * adults)}</span>
                                            </div>

                                            <div className="flex items-start justify-between gap-4 text-on-surface-variant">
                                                <span className="min-w-0">{t("tourDetail.childrenLine", { children })}</span>
                                                <span className="shrink-0 text-right">{formatPrice(childPrice * children)}</span>
                                            </div>

                                            {infants > 0 || infantPrice > 0 ? (
                                                <div className="flex items-start justify-between gap-4 text-on-surface-variant">
                                                    <span className="min-w-0">{t("tourDetail.infantsLine", { infants })}</span>
                                                    <span className="shrink-0 text-right">{formatPrice(infantPrice * infants)}</span>
                                                </div>
                                            ) : null}

                                            <div className="flex items-start justify-between gap-4 text-on-surface-variant">
                                                <span className="min-w-0">{t("tourDetail.hotelLine", { rooms: roomCount, nights })}</span>
                                                <span className="shrink-0 text-right">{formatPrice(hotelTotal)}</span>
                                            </div>

                                            <div className="flex items-start justify-between gap-4 text-on-surface-variant">
                                                <span className="min-w-0">{t("tourDetail.transport")}</span>
                                                <span className="shrink-0 text-right">{formatPrice(transportTotal)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="font-bold text-xl">{t("tourDetail.total")}</span>
                                                <span className="font-bold text-2xl text-primary">
                                                    {formatPrice(total)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-6">
                                            <Switch
                                                checked={isPrivate}
                                                onCheckedChange={setIsPrivate}
                                                id="private-switch"
                                                disabled={isLockedPrivate}
                                            />
                                            <label
                                                htmlFor="private-switch"
                                                className={`font-semibold text-base ${isLockedPrivate ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                                            >
                                                {t("tourDetail.bookAs")}{" "}
                                                <span className={isPrivate ? "text-primary" : "text-slate-500"}>
                                                    {isPrivate ? t("tourDetail.private") : t("tourDetail.group")}
                                                </span>{" "}
                                                {t("tourDetail.tour")}
                                            </label>
                                            {isPrivate && (
                                                <span className="ml-2 text-sm text-primary font-semibold">
                                                    x{privateMultiplier} {t("tourDetail.price")}
                                                </span>
                                            )}
                                        </div>
                                        {isLockedPrivate ? (
                                            <p className="text-sm text-primary font-medium">
                                                Tour này được provider thiết kế riêng cho nhóm của bạn nên chỉ đặt ở chế độ private.
                                            </p>
                                        ) : null}
                                        {bookingDisabledReason ? (
                                            <p className="text-sm font-medium text-rose-600">
                                                {bookingDisabledReason}
                                            </p>
                                        ) : null}

                                        <button
                                            className={`w-full py-4 rounded-xl editorial-gradient text-white font-bold text-lg shadow-lg transition-all ${
                                                !selectedScheduleId || bookingSubmitting || Boolean(bookingDisabledReason)
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:scale-[1.02] active:scale-[0.98]"
                                            }`}
                                            type="button"
                                            onClick={handleBooking}
                                            disabled={!selectedScheduleId || bookingSubmitting || Boolean(bookingDisabledReason)}
                                        >
                                            {!selectedScheduleId
                                                ? t("tourDetail.chooseDateButton")
                                                : bookingSubmitting
                                                  ? t("tourDetail.creatingPayment")
                                                  : t("tourDetail.confirmBooking")}
                                        </button>

                                        <p className="text-center text-xs text-on-surface-variant px-4">
                                            {t("tourDetail.reservationHint")}

                                        </p>
                                        <p className="text-center text-xs text-on-surface-variant px-4">
                                            {t("tourDetail.serviceRequestHint")}

                                        </p>
                                    </div>
                                </div>

                                <div className="bg-surface-container-low rounded-3xl p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                        <img
                                            alt={displayedGuide?.fullName || t("tourDetail.guide")}
                                            className="w-full h-full object-cover"
                                            src={
                                                displayedGuide?.avatarUrl ||
                                                "https://lh3.googleusercontent.com/aida-public/AB6AXuD0BfviMsRmGSM1xnCOiLAjEB-Xdb5zdVkaJer9i8EJDmcHyk3B_cx3NNEUzYZx5eeXLb3knh4GSyKV1fU2pKt6dX7NkkJOM-qqssY1oLkNGpRLgm3AiSVVcnGdAVSqgMJeL-mStHglR2Rc9V12kuRO9iwN7ZjrDqchBTD7BWXOm-mCLk6H7Q8mnXUOH5vIX9avqy2wQ7x_g34-VVu4BanY1QQ1qVm-2_PkEjdf_nz1PHmI3pTuP8jQkRkJa9qDZRvYGjv8ySp5VHSG"
                                            }
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-primary uppercase">{t("tourDetail.suggestedGuide")}</p>
                                        <p className="font-bold">{displayedGuide?.fullName || t("tourDetail.guidePending")}</p>
                                        <p className="text-xs text-on-surface-variant">
                                            {displayedGuide?.specialty || displayedGuide?.email || t("tourDetail.guideInfoPending")}
                                        </p>
                                    </div>
                                    <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors">
                                        <span className="material-symbols-outlined text-on-surface-variant">chat</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="mt-16 lg:mt-24 space-y-8">
                        <div className="space-y-2">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                                {t("tourDetail.feedback")}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface">
                                {t("tourDetail.reviewsRatings")}
                            </h2>
                            <p className="text-on-surface-variant max-w-3xl leading-relaxed">
                                {t("tourDetail.reviewIntro")}


                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
                                <div className="text-center mb-8">
                                    <div className="text-6xl font-headline font-black text-on-surface mb-2">
                                        {averageTourRating || "0.0"}
                                    </div>
                                    <div className="flex justify-center gap-1 mb-2">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <span
                                                key={idx}
                                                className="material-symbols-outlined text-tertiary text-2xl"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                star
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-on-surface-variant font-medium">
                                        {t("tourDetail.authenticReviews", { count: reviewCount })}
                                    </p>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <span className="w-12">{t("tourDetail.stars", { count: 5 })}</span>
                                        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full w-[85%]" />
                                        </div>
                                        <span className="w-8 text-right">85%</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <span className="w-12">{t("tourDetail.stars", { count: 4 })}</span>
                                        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full w-[10%] opacity-60" />
                                        </div>
                                        <span className="w-8 text-right">10%</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <span className="w-12">{t("tourDetail.stars", { count: 3 })}</span>
                                        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full w-[3%] opacity-40" />
                                        </div>
                                        <span className="w-8 text-right">3%</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <span className="w-12">{t("tourDetail.stars", { count: 2 })}</span>
                                        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full w-[1%] opacity-20" />
                                        </div>
                                        <span className="w-8 text-right">1%</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <span className="w-12">{t("tourDetail.stars", { count: 1 })}</span>
                                        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full w-[1%] opacity-10" />
                                        </div>
                                        <span className="w-8 text-right">1%</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {REVIEW_TAG_KEYS.map((tagKey) => (
                                        <span
                                            key={tagKey}
                                            className="px-3 py-1 bg-tertiary-container/10 text-on-tertiary-fixed-variant rounded-full text-xs font-bold"
                                        >
                                            {t(tagKey)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-8 relative overflow-hidden">
                                <div className="flex justify-between items-center mb-6 gap-4">
                                    <h3 className="text-xl font-headline font-bold text-on-surface">
                                        {t("tourDetail.travelerMemories")}
                                    </h3>
                                    <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline transition-all">
                                        {t("tourDetail.viewAllPhotos")}
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>

                                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                    {MEMORY_CARDS.map((m) => (
                                        <div
                                            key={m.alt}
                                            className="min-w-[240px] h-[320px] rounded-2xl overflow-hidden relative group"
                                        >
                                            <img
                                                alt={m.alt}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                src={m.img}
                                            />
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <p className="text-xs font-medium opacity-80">
                                                    {t("tourDetail.photoBy", { name: m.by })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 flex justify-center items-center gap-4">
                                    <button
                                        className="p-2 border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-colors disabled:opacity-30"
                                        disabled
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3].map((p, idx) => (
                                            <button
                                                key={p}
                                                className={`w-10 h-10 rounded-xl ${
                                                    idx === 0
                                                        ? "bg-primary text-on-primary font-bold text-sm"
                                                        : "hover:bg-surface-container font-semibold text-sm"
                                                }`}
                                                type="button"
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <span className="px-2 text-on-surface-variant">...</span>
                                        <button
                                            className="w-10 h-10 rounded-xl hover:bg-surface-container font-semibold text-sm"
                                            type="button"
                                        >
                                            42
                                        </button>
                                    </div>
                                    <button
                                        className="p-2 border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-colors"
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>

                                <div className="space-y-6 mt-8">
                                    {reviews.length === 0 ? (
                                        <div className="bg-surface-container-lowest rounded-2xl p-8 text-center text-on-surface-variant">
                                            {t("tourDetail.noReviews")}
                                        </div>
                                    ) : (
                                        reviews.map((r) => (
                                            <article
                                                key={r._id}
                                                className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                                            >
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div className="md:w-48 shrink-0">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200">
                                                                <img
                                                                    alt={r.reviewerId?.fullName || t("tourDetail.traveler")}
                                                                    className="w-full h-full object-cover"
                                                                    src={
                                                                        r.reviewerId?.avatarUrl ||
                                                                        "https://lh3.googleusercontent.com/aida-public/AB6AXuD0BfviMsRmGSM1xnCOiLAjEB-Xdb5zdVkaJer9i8EJDmcHyk3B_cx3NNEUzYZx5eeXLb3knh4GSyKV1fU2pKt6dX7NkkJOM-qqssY1oLkNGpRLgm3AiSVVcnGdAVSqgMJeL-mStHglR2Rc9V12kuRO9iwN7ZjrDqchBTD7BWXOm-mCLk6H7Q8mnXUOH5vIX9avqy2wQ7x_g34-VVu4BanY1QQ1qVm-2_PkEjdf_nz1PHmI3pTuP8jQkRkJa9qDZRvYGjv8ySp5VHSG"
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-on-surface text-sm">
                                                                    {r.reviewerId?.fullName || t("tourDetail.traveler")}
                                                                </h4>
                                                                <div className="flex items-center gap-1 text-[10px] text-teal-600 font-bold uppercase tracking-wider">
                                                                    <span
                                                                        className="material-symbols-outlined text-xs"
                                                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                                                    >
                                                                        verified
                                                                    </span>
                                                                    {t("tourDetail.verified")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-on-surface-variant mb-1">
                                                            {t("tourDetail.tourRating")}: {r.ratingTour}/5
                                                        </p>
                                                        <p className="text-xs text-on-surface-variant">
                                                            {t("tourDetail.guideRating")}: {r.ratingGuide}/5
                                                        </p>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex gap-0.5">
                                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="material-symbols-outlined text-tertiary text-sm"
                                                                        style={{
                                                                            fontVariationSettings:
                                                                                idx < r.ratingTour ? '"FILL" 1' : '"FILL" 0',
                                                                        }}
                                                                    >
                                                                        star
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <time className="text-xs text-on-surface-variant">
                                                                {r.createdAt
                                                                    ? new Date(r.createdAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
                                                                          month: "short",
                                                                          day: "2-digit",
                                                                          year: "numeric",
                                                                      })
                                                                    : ""}
                                                            </time>
                                                        </div>

                                                        <h3 className="text-lg font-headline font-bold text-on-surface mb-3">
                                                            {r.tourId?.name || tour?.name}
                                                        </h3>
                                                        <p className="text-on-surface-variant leading-relaxed mb-4">
                                                            {r.contentTour || t("tourDetail.noTourFeedback")}
                                                        </p>
                                                        <div className="rounded-xl bg-surface-container-low p-4">
                                                            <p className="text-xs font-bold uppercase tracking-wider text-primary">
                                                                {t("tourDetail.guideFeedback")}
                                                            </p>
                                                            <p className="mt-2 text-sm text-on-surface-variant">
                                                                {r.contentGuide || t("tourDetail.noGuideFeedback")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
