import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    BedDouble,
    CarFront,
    CirclePlus,
    ConciergeBell,
    Focus,
    ImagePlus,
    Mountain,
    ShieldCheck,
    Sun,
    UtensilsCrossed,
    WandSparkles,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

export default function DialogCreateTour({
    open,
    onOpenChange,
    tour,
    setTour,
    services,
    guides,
    handleClick,
    loading,
    days,
    setDays,
    editingTourId,
    selectedImage,
    setSelectedImage,
    existingImages,
    setExistingImages,
    newImages,
    setNewImages,
}) {
    useEffect(() => {
        const urls = newImages.map((file) => URL.createObjectURL(file));

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [newImages]);
    useEffect(() => {
        const itineraries = days.map((d) => ({
            dayNumber: d.dayNumber,
            description: d.description,
            activities: d.activities
                .filter((a) => a.serviceId && a.time)
                .map((a) => ({
                    time: a.time,
                    serviceId: a.serviceId,
                    statusActivity: "NOT_DONE",
                })),
        }));

        setTour((prev) => ({
            ...prev,
            numberOfDay: days.length, // 👈 giữ nguyên số ngày
            itineraries,
        }));
    }, [days]);
    useEffect(() => {
        const price = calculateTourPrice(days, services);

        setTour((prev) => ({
            ...prev,
            price,
        }));
    }, [days, services]);
    const calculateTourPrice = (days, services) => {
        let adult = 0;
        let child = 0;
        let infant = 0;

        days.forEach((day) => {
            day.activities.forEach((act) => {
                const service = services.find((s) => s._id === act.serviceId);
                if (!service) return;

                adult += service.total?.find((t) => t.type === "ADULT")?.price || 0;
                child += service.total?.find((t) => t.type === "CHILD")?.price || 0;
                infant += service.total?.find((t) => t.type === "INFANT")?.price || 0;
            });
        });

        return { adult, child, infant };
    };
    const serviceMap = services.reduce((acc, s) => {
        acc[s._id] = s;
        return acc;
    }, {});
    const selectedHotel = services.find((s) => s._id === tour.hotelServiceId);
    const selectedTransport = services.find((s) => s._id === tour.transportServiceId);
    const selectedGuide = guides.find((s) => s._id === tour.leadDuideServiceId);
    const handlePriceChange = (type, value) => {
        setTour((prev) => ({
            ...prev,
            price: {
                ...prev.price,
                [type]: value === "" ? "" : Number(value),
            },
        }));
    };
    const handleAddActivity = (dayIndex) => {
        setDays((prev) =>
            prev.map((day, index) =>
                index === dayIndex
                    ? {
                          ...day,
                          activities: [
                              ...day.activities,
                              {
                                  time: "",
                                  title: "",
                                  statusActivity: "NOT_DONE",
                                  serviceId: "",
                                  search: "",
                                  isFocus: false,
                                  image: "",
                              },
                          ],
                      }
                    : day,
            ),
        );
    };
    const handleRemoveActivity = (dayIndex, activityIndex) => {
        setDays((prev) =>
            prev.map((day, dIndex) =>
                dIndex === dayIndex
                    ? {
                          ...day,
                          activities: day.activities.filter((_, aIndex) => aIndex !== activityIndex),
                      }
                    : day,
            ),
        );
    };
    const handleRemoveDay = (dayIndex) => {
        setDays((prev) => {
            const newDays = prev.filter((_, index) => index !== dayIndex);
            return newDays.map((day, i) => ({
                ...day,
                dayNumber: i + 1,
            }));
        });
    };
    const handleAddDay = () => {
        setDays((prev) => [
            ...prev,
            {
                dayNumber: prev.length + 1,
                description: "",
                activities: [
                    {
                        time: "",
                        title: "",
                        statusActivity: "NOT_DONE",
                        serviceId: "",
                        search: "",
                        isFocus: false,
                        image: "",
                    },
                ],
            },
        ]);
    };
    const updateActivity = (dayIndex, activityIndex, data) => {
        setDays((prev) =>
            prev.map((day, dIndex) =>
                dIndex === dayIndex
                    ? {
                          ...day,
                          activities: day.activities.map((act, aIndex) =>
                              aIndex === activityIndex ? { ...act, ...data } : act,
                          ),
                      }
                    : day,
            ),
        );
    };
    const updateDayDescription = (dayIndex, value) => {
        setDays((prev) => prev.map((day, index) => (index === dayIndex ? { ...day, description: value } : day)));
    };
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="flex max-h-[92vh] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-[2rem] border-none bg-surface p-0 sm:max-w-6xl">
                    <DialogHeader className="border-b border-slate-200 px-6 py-5">
                        <DialogTitle className="font-headline text-2xl font-extrabold text-on-surface">
                            Create Tour
                        </DialogTitle>
                        <DialogDescription className="text-sm text-on-surface-variant">
                            Fill in the tour details, itinerary, and logistics without leaving the manage tours
                            dashboard.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
                        <div className="space-y-10" aria-label="Edit tour form">
                            <section className="space-y-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tertiary-container text-on-tertiary-fixed">
                                            <WandSparkles className="size-5" />
                                        </div>
                                        <div>
                                            <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">
                                                Itinerary Builder
                                            </h2>
                                            <p className="text-sm text-on-surface-variant">
                                                Build a vivid, traveler-friendly day plan with strong visual cues and
                                                descriptive copy.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddDay}
                                        className="h-11 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 font-bold text-primary"
                                    >
                                        <CirclePlus className="size-4" />
                                        Add Day
                                    </Button>
                                </div>

                                {days.map((day, dayIndex) => (
                                    <Card
                                        key={dayIndex}
                                        className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
                                    >
                                        <div className="flex flex-col gap-4 bg-surface-container-low px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
                                                    {dayIndex + 1}
                                                </span>
                                                <div>
                                                    <h3 className="font-headline text-lg font-bold text-on-surface">
                                                        Day {dayIndex + 1}
                                                    </h3>
                                                    <p className="text-xs text-on-surface-variant">
                                                        {dayIndex === 0
                                                            ? "Introduce the rhythm, setting, and tone of the tour."
                                                            : "Shape the next chapter of the traveler experience."}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => handleAddActivity(dayIndex)}
                                                    className="h-10 rounded-xl border-dashed border-primary/25 bg-primary/5 px-4 font-semibold text-primary"
                                                >
                                                    <CirclePlus className="size-4" />
                                                    Add Activity
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveDay(dayIndex)}
                                                    className="h-10 rounded-xl border-dashed border-red-800/25 bg-red-800/5 px-4 font-semibold text-red-800"
                                                >
                                                    <X className="size-4" />
                                                    Delete Day
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="px-6 pt-6">
                                            <div className="mb-3 flex items-center justify-between">
                                                <label className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                                                    Day Description
                                                </label>
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                    Optional
                                                </span>
                                            </div>

                                            <Textarea
                                                placeholder="Describe what travelers will experience this day..."
                                                value={day.description}
                                                onChange={(e) => updateDayDescription(dayIndex, e.target.value)}
                                                className="min-h-[90px] rounded-xl border border-slate-200 bg-surface-container-low px-4 py-3 text-sm leading-relaxed focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <CardContent className="space-y-8 p-6">
                                            {day.activities.map((activity, activityIndex) => {
                                                const filteredServices = services.filter((s) =>
                                                    s.name.toLowerCase().includes(activity.search.toLowerCase()),
                                                );
                                                return (
                                                    <div
                                                        key={activityIndex}
                                                        className={`grid grid-cols-1 gap-6 lg:grid-cols-3 ${
                                                            activityIndex > 0 ? "border-t border-slate-100 pt-8" : ""
                                                        }`}
                                                    >
                                                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
                                                            {activity.image ? (
                                                                <img
                                                                    src={activity.image}
                                                                    alt={activity.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                                                                    <ImagePlus className="size-6" />
                                                                    <p className="text-xs mt-2">No image</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-4 lg:col-span-2">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                                                                    {activityIndex === 0 ? (
                                                                        <Sun className="size-4" />
                                                                    ) : activityIndex === 1 ? (
                                                                        <UtensilsCrossed className="size-4" />
                                                                    ) : (
                                                                        <Mountain className="size-4" />
                                                                    )}
                                                                    {`Activity ${activityIndex + 1}`}
                                                                </div>

                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    onClick={() =>
                                                                        handleRemoveActivity(dayIndex, activityIndex)
                                                                    }
                                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                                                >
                                                                    <X className="size-4" />
                                                                </Button>
                                                            </div>
                                                            <div className="relative">
                                                                <div className="relative">
                                                                    <Input
                                                                        placeholder="Search service..."
                                                                        value={activity.search}
                                                                        onChange={(e) =>
                                                                            updateActivity(dayIndex, activityIndex, {
                                                                                search: e.target.value,
                                                                            })
                                                                        }
                                                                        onFocus={() =>
                                                                            updateActivity(dayIndex, activityIndex, {
                                                                                isFocus: true,
                                                                            })
                                                                        }
                                                                        onBlur={() => {
                                                                            setTimeout(() => {
                                                                                updateActivity(
                                                                                    dayIndex,
                                                                                    activityIndex,
                                                                                    {
                                                                                        isFocus: false,
                                                                                    },
                                                                                );
                                                                            }, 150);
                                                                        }}
                                                                        className="h-12 rounded-xl bg-surface-container-low pr-10" // 👈 chừa chỗ cho nút X
                                                                    />

                                                                    {activity.search && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                updateActivity(
                                                                                    dayIndex,
                                                                                    activityIndex,
                                                                                    {
                                                                                        search: "",
                                                                                        serviceId: "",
                                                                                        title: "",
                                                                                        image: "",
                                                                                    },
                                                                                )
                                                                            }
                                                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-slate-200 transition"
                                                                        >
                                                                            <X className="size-4 text-slate-500" />
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {activity.isFocus && (
                                                                    <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                                                                        <div className="max-h-56 overflow-y-auto">
                                                                            {filteredServices.length > 0 ? (
                                                                                filteredServices.map((s) => {
                                                                                    const price = s.total.find(
                                                                                        (t) => t.type === "ADULT",
                                                                                    )?.price;

                                                                                    return (
                                                                                        <div
                                                                                            key={s._id}
                                                                                            onClick={() => {
                                                                                                updateActivity(
                                                                                                    dayIndex,
                                                                                                    activityIndex,
                                                                                                    {
                                                                                                        serviceId:
                                                                                                            s._id,
                                                                                                        search: s.name,
                                                                                                        title: s.name,
                                                                                                        image: s.image,
                                                                                                        isFocus: false,
                                                                                                    },
                                                                                                );
                                                                                            }}
                                                                                            className="cursor-pointer px-4 py-3 hover:bg-slate-100"
                                                                                        >
                                                                                            <div className="flex justify-between">
                                                                                                <span className="font-medium">
                                                                                                    {s.name}
                                                                                                </span>
                                                                                                <span className="text-primary font-semibold text-sm">
                                                                                                    {price
                                                                                                        ? `$${price}`
                                                                                                        : "Free"}
                                                                                                </span>
                                                                                            </div>
                                                                                            <p className="text-xs text-slate-500">
                                                                                                {s.address}
                                                                                            </p>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            ) : (
                                                                                <p className="p-3 text-sm text-slate-400">
                                                                                    No service found
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Input
                                                                type="time"
                                                                value={activity.time}
                                                                onChange={(e) =>
                                                                    updateActivity(dayIndex, activityIndex, {
                                                                        time: e.target.value,
                                                                    })
                                                                }
                                                                className="h-12 rounded-xl border-none bg-surface-container-low px-4"
                                                            />
                                                            <div className="mt-4">
                                                                {activity.serviceId &&
                                                                serviceMap[activity.serviceId] ? (
                                                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                                                                        <div className="flex items-start justify-between">
                                                                            <p className="text-sm font-semibold text-slate-800">
                                                                                {serviceMap[activity.serviceId].name}
                                                                            </p>

                                                                            <span className="text-[11px] font-bold uppercase text-primary">
                                                                                {serviceMap[activity.serviceId].type}
                                                                            </span>
                                                                        </div>

                                                                        <p className="text-xs text-slate-600 line-clamp-2">
                                                                            {serviceMap[activity.serviceId].description}
                                                                        </p>

                                                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                                                            {serviceMap[activity.serviceId].total?.map(
                                                                                (t) => (
                                                                                    <div
                                                                                        key={t.type}
                                                                                        className="rounded-lg bg-white p-2 text-center border"
                                                                                    >
                                                                                        <p className="text-[10px] text-slate-500">
                                                                                            {t.type}
                                                                                        </p>
                                                                                        <p className="text-sm font-bold text-slate-800">
                                                                                            ${t.price}
                                                                                        </p>
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                                                                        <p className="text-xs text-slate-500">
                                                                            Chưa chọn service — hãy tìm và chọn hoạt
                                                                            động cho ngày này
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleAddActivity(dayIndex)}
                                                className="h-11 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 px-4 font-bold text-primary"
                                            >
                                                <CirclePlus className="size-4" />
                                                Add Activity To Day {dayIndex + 1}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </section>

                            <section className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
                                        <ConciergeBell className="size-5" />
                                    </div>

                                    <div>
                                        <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">
                                            Services & Logistics
                                        </h2>
                                        <p className="text-sm text-on-surface-variant">
                                            Select the operational details that support the traveler experience on the
                                            ground.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                    <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                                        <CardHeader className="px-6 pt-6">
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                                                    Hotel
                                                </CardTitle>

                                                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                                                    From $120/night
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-5 px-6 pb-6">
                                            <Select
                                                value={tour.hotelServiceId}
                                                onValueChange={(value) =>
                                                    setTour((prev) => ({
                                                        ...prev,
                                                        hotelServiceId: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl border-outline-variant/20 bg-surface-container-low px-4 text-sm font-semibold w-full">
                                                    <SelectValue placeholder="Select hotel" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {services
                                                        .filter((s) => s.type === "HOTEL")
                                                        .map((s) => (
                                                            <SelectItem key={s._id} value={s._id}>
                                                                {s.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>

                                            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-surface-container-low p-4 transition-all">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                    <BedDouble className="size-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    {selectedHotel ? (
                                                        <>
                                                            <p className="truncate text-sm font-bold text-on-surface">
                                                                {selectedHotel.name}
                                                            </p>

                                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                                {selectedHotel.description}
                                                            </p>

                                                            <p className="mt-1 text-[11px] font-semibold text-primary">
                                                                {selectedHotel.address}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-slate-400">Chưa chọn khách sạn</p>
                                                    )}
                                                </div>

                                                {selectedHotel?.total?.[0]?.price && (
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-primary">
                                                            ${selectedHotel?.total?.[0]?.price}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500">starting</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                                        <CardHeader className="px-6 pt-6">
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                                                    Transport
                                                </CardTitle>

                                                <span className="rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-bold text-secondary">
                                                    From $50
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-5 px-6 pb-6">
                                            <Select
                                                value={tour.transportServiceId}
                                                onValueChange={(value) =>
                                                    setTour((prev) => ({
                                                        ...prev,
                                                        transportServiceId: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl border-outline-variant/20 bg-surface-container-low px-4 text-sm font-semibold w-full">
                                                    <SelectValue placeholder="Select transport" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {services
                                                        .filter((s) => s.type === "TRANSPORT")
                                                        .map((s) => (
                                                            <SelectItem key={s._id} value={s._id}>
                                                                {s.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>

                                            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-surface-container-low p-4 transition-all">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                    <CarFront className="size-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    {selectedTransport ? (
                                                        <>
                                                            <p className="truncate text-sm font-bold text-on-surface">
                                                                {selectedTransport.name}
                                                            </p>

                                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                                {selectedTransport.description}
                                                            </p>

                                                            <p className="mt-1 text-[11px] font-semibold text-slate-500">
                                                                {selectedTransport.address}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-slate-400">Chưa chọn phương tiện</p>
                                                    )}
                                                </div>

                                                {selectedTransport?.total?.[0]?.price && (
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-primary">
                                                            ${selectedTransport?.total?.[0]?.price}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500">trip</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                                        <CardHeader className="px-6 pt-6">
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                                                    Lead Guide
                                                </CardTitle>

                                                <span className="rounded-full bg-tertiary/10 px-3 py-1 text-[10px] font-bold text-tertiary">
                                                    Assigned
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-5 px-6 pb-6">
                                            <Select
                                                value={tour.leadDuideServiceId}
                                                onValueChange={(value) =>
                                                    setTour((prev) => ({
                                                        ...prev,
                                                        leadDuideServiceId: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl border-outline-variant/20 bg-surface-container-low px-4 text-sm font-semibold w-full">
                                                    <SelectValue placeholder="Select lead guide" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {guides
                                                        .filter((g) => g.role === "GUIDE")
                                                        .map((g) => (
                                                            <SelectItem key={g._id} value={g._id}>
                                                                {g.fullName || g.email}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>

                                            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-surface-container-low p-4 transition-all">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary">
                                                    <ShieldCheck className="size-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    {selectedGuide ? (
                                                        <>
                                                            <p className="truncate text-sm font-bold text-on-surface">
                                                                {selectedGuide.fullName || selectedGuide.email}
                                                            </p>

                                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                                {selectedGuide.email}
                                                            </p>

                                                            <p className="mt-1 text-[11px] font-semibold text-tertiary">
                                                                GUIDE • Certified
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-slate-400">Chưa chọn guide</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>

                            <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                                <CardHeader className="px-6 pt-6">
                                    <CardTitle className="font-headline text-2xl font-bold">
                                        Basic Information
                                    </CardTitle>
                                    <p className="text-sm text-on-surface-variant">
                                        Configure your tour details and how it will be scheduled.
                                    </p>
                                </CardHeader>

                                <CardContent className="grid grid-cols-1 gap-6 px-6 pb-6 md:grid-cols-2">
                                    {/* IMAGE */}
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                                            Tour Images
                                        </label>

                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                setNewImages((prev) => [...prev, ...files]);
                                                e.target.value = null;
                                            }}
                                        />

                                        <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
                                            {existingImages?.length > 0 || newImages?.length > 0 ? (
                                                <>
                                                    {existingImages.map((img, i) => (
                                                        <div
                                                            key={i}
                                                            className="relative group w-32 h-32 rounded-2xl overflow-hidden border cursor-pointer"
                                                            onClick={() => setSelectedImage(img.imageUrl)}
                                                        >
                                                            <img
                                                                src={img.imageUrl}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setExistingImages((prev) =>
                                                                        prev.filter((_, index) => index !== i),
                                                                    );
                                                                }}
                                                                className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <X className="size-4" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {newImages.map((file, i) => (
                                                        <div
                                                            key={i}
                                                            className="relative group w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/50 cursor-pointer"
                                                            onClick={() => setSelectedImage(URL.createObjectURL(file))}
                                                        >
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setNewImages((prev) =>
                                                                        prev.filter((_, index) => index !== i),
                                                                    );
                                                                }}
                                                                className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <X className="size-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <p className="text-sm text-slate-400">No images</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* NAME */}
                                    <div>
                                        <label className="mb-2 text-xs font-bold uppercase text-slate-500">
                                            Tour Name
                                        </label>
                                        <Input
                                            value={tour.name}
                                            onChange={(e) => setTour({ ...tour, name: e.target.value })}
                                        />
                                    </div>

                                    {/* LOCATION */}
                                    <div>
                                        <label className="mb-2 text-xs font-bold uppercase text-slate-500">
                                            Location
                                        </label>
                                        <Input
                                            value={tour.location}
                                            onChange={(e) => setTour({ ...tour, location: e.target.value })}
                                        />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div className="md:col-span-2">
                                        <label className="mb-2 text-xs font-bold uppercase text-slate-500">
                                            Description
                                        </label>
                                        <Textarea
                                            value={tour.description}
                                            onChange={(e) => setTour({ ...tour, description: e.target.value })}
                                        />
                                    </div>

                                    {/* PRICE */}
                                    <div>
                                        <label className="mb-2 text-xs font-bold uppercase text-slate-500">Price</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {["adult", "child", "infant"].map((t) => (
                                                <Input
                                                    key={t}
                                                    type="number"
                                                    value={tour.price[t]}
                                                    onChange={(e) =>
                                                        setTour({
                                                            ...tour,
                                                            price: { ...tour.price, [t]: Number(e.target.value) },
                                                        })
                                                    }
                                                    placeholder={t}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* TYPE */}
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                                            Tour Type
                                        </label>

                                        <Select
                                            value={tour.type}
                                            onValueChange={(value) => setTour({ ...tour, type: value })}
                                        >
                                            <SelectTrigger className="h-14 w-full rounded-2xl bg-surface-container-low px-4 font-semibold">
                                                <SelectValue placeholder="Select tour type" />
                                            </SelectTrigger>

                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="GROUP">Group</SelectItem>
                                                <SelectItem value="PRIVATE">Private</SelectItem>
                                                <SelectItem value="CUSTOM">Custom</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {tour.type === "GROUP" && "Tour ghép đoàn, cần đủ người"}
                                            {tour.type === "PRIVATE" && "Tour riêng, luôn khởi hành"}
                                            {tour.type === "CUSTOM" && "Tour tùy chỉnh theo nhu cầu"}
                                        </p>
                                    </div>

                                    {/* SCHEDULE TYPE */}
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                                            Schedule Type
                                        </label>

                                        <Select
                                            value={tour.scheduleType}
                                            onValueChange={(value) => setTour({ ...tour, scheduleType: value })}
                                        >
                                            <SelectTrigger className="h-14 w-full rounded-2xl bg-surface-container-low px-4 font-semibold">
                                                <SelectValue placeholder="Select schedule type" />
                                            </SelectTrigger>

                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="FIXED">Fixed</SelectItem>
                                                <SelectItem value="DAILY">Daily</SelectItem>
                                                <SelectItem value="FLEXIBLE">Flexible</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {tour.scheduleType === "FIXED" && "Chạy theo ngày cố định"}
                                            {tour.scheduleType === "DAILY" && "Ngày nào cũng có"}
                                            {tour.scheduleType === "FLEXIBLE" && "Khách tự chọn ngày"}
                                        </p>
                                    </div>

                                    {/* DURATION */}
                                    <div>
                                        <label className="mb-2 text-xs font-bold uppercase text-slate-500">
                                            Duration (Days)
                                        </label>
                                        <Input value={tour.numberOfDay} readOnly />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DialogFooter className="mx-0 mb-0 shrink-0 flex-col gap-3 rounded-none border-t border-slate-200 bg-surface px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange?.(false)}
                            className="h-11 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-600"
                        >
                            Cancel
                        </Button>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl border-outline-variant/30 bg-white px-5 font-semibold text-slate-600"
                            >
                                Save Draft
                            </Button>
                            <Button
                                onClick={handleClick}
                                disabled={loading}
                                className="h-11 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 font-bold text-on-primary shadow-lg shadow-primary/15"
                            >
                                {loading ? <Spinner /> : `${editingTourId ? "Update Tour" : "Publish Tour"}`}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent
                    showCloseButton={false}
                    className="sm:max-w-[750px] max-h-[750px] bg-amber-200/0 border-none shadow-none p-0"
                >
                    <DialogDescription>
                        <img src={selectedImage} className="w-full h-full shadow-2xl rounded-2xl" alt="" />
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </>
    );
}
