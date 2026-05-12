import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DialogCreateTour from "./DialogCreateTour";
import ManageToursStats from "./ManageToursStats";
import ManageToursTable from "./ManageToursTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getServices } from "@/services/api/service";
import toast from "react-hot-toast";
import { createTour, deleteTourById, updateTourById } from "@/services/api/tour";
import { getTours } from "@/services/api/tour";
import { syncTourImagesApi, uploadImagesApi } from "@/services/api/image";
import ManageToursTableSkeleton from "./ManageToursTableSkeleton";
import { useI18n } from "@/i18n/I18nProvider";
const defaultTour = {
    location: "",
    price: {
        adult: 0,
        child: 0,
        infant: 0,
    },
    numberOfDay: 1,
    itineraries: [],
    availableServices: [],
    description: "",
    name: "",
    type: "GROUP",
    scheduleType: "FIXED",
};
const defaultDays = [
    {
        dayNumber: 1,
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
];
export default function ManageTours() {
    const { t } = useI18n();
    const [loading, setLoading] = useState(false);
    const [tours, setTours] = useState([]);
    const [tour, setTour] = useState(defaultTour);
    const [services, setServices] = useState([]);
    const [days, setDays] = useState(defaultDays);
    const [open, setOpen] = useState(false);
    const [editingTourId, setEditingTourId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loadingTours, setLoadingTours] = useState(false);
    const handleOpenDialog = () => {
        setOpen(true);
        setEditingTourId(null);
        setTour(defaultTour);
        setDays(defaultDays);
        setExistingImages([]);
        setNewImages([]);
    };
    
    const mapTourToDays = (tour, services) => {
        return tour.itineraries.map((d) => ({
            dayNumber: d.dayNumber,
            description: d.description,
            activities: d.activities.map((a) => {
                const service = services.find((s) => s._id === (a.serviceId?._id || a.serviceId)) || {};

                return {
                    time: a.time,
                    serviceId: a.serviceId?._id || a.serviceId,
                    search: service.name || "",
                    title: service.name || "",
                    image: service.image || "",
                    isFocus: false,
                    statusActivity: a.statusActivity,
                };
            }),
        }));
    };
    const mapDaysToItineraries = (days) => {
        return days.map((d) => ({
            dayNumber: d.dayNumber,
            description: d.description,
            activities: d.activities
                .filter((a) => a.serviceId)
                .map((a) => ({
                    time: a.time || null,
                    serviceId: a.serviceId,
                    statusActivity: a.statusActivity || "NOT_DONE",
                })),
        }));
    };
    const validateTourForm = () => {
        if (!tour.name.trim()) return "Vui lòng nhập tên tour.";
        if (!tour.location.trim()) return "Vui lòng nhập địa điểm tour.";
        if (!tour.description.trim()) return "Vui lòng nhập mô tả tour.";
        if (!Number.isInteger(Number(tour.numberOfDay)) || Number(tour.numberOfDay) < 1) {
            return "Thời lượng tour phải từ 1 ngày trở lên.";
        }
        if (Number(tour.price?.adult) < 0 || Number(tour.price?.child) < 0 || Number(tour.price?.infant) < 0) {
            return "Giá tour không được âm.";
        }
        if (!days.length) return "Vui lòng thêm ít nhất 1 ngày lịch trình.";
        const hasActivity = days.some((day) => day.activities?.some((activity) => activity.serviceId));
        if (!hasActivity) return "Vui lòng chọn ít nhất 1 dịch vụ cho lịch trình.";
        return "";
    };
    const handleCreateTour = async () => {
        const validationMessage = validateTourForm();
        if (validationMessage) {
            toast.error(validationMessage);
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...tour,
                name: tour.name.trim(),
                location: tour.location.trim(),
                description: tour.description.trim(),
                leadGuideServiceId: undefined,
                itineraries: mapDaysToItineraries(days),
            };
            const res = await createTour(payload);
            const newTour = res?.data?.data;
            let updatedTour = newTour;

            if (!newTour?._id) {
                throw new Error(t("provider.tours.toastCreateFailed"));
            }

            if (newImages.length > 0) {
                const uploadRes = await uploadImagesApi(newImages, "TOUR", newTour._id);

                const uploadedUrls = (uploadRes?.data?.data || []).map((img) => img.imageUrl);

                updatedTour = {
                    ...newTour,
                    images: uploadedUrls.map((url) => ({ imageUrl: url })),
                };
            }
            setTours((prev) => [updatedTour, ...prev].filter(Boolean));
            toast.success(t("provider.tours.toastCreateSuccess"));
            setTour(defaultTour);
            setDays(defaultDays);
            setExistingImages([]);
            setNewImages([]);
            setOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || t("provider.tours.toastCreateFailed"));
        } finally {
            setLoading(false);
        }
    };
    const handleUpdateTour = async () => {
        const validationMessage = validateTourForm();
        if (validationMessage) {
            toast.error(validationMessage);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...tour,
                name: tour.name.trim(),
                location: tour.location.trim(),
                description: tour.description.trim(),
                leadGuideServiceId: undefined,
                itineraries: mapDaysToItineraries(days),
            };

            await updateTourById(editingTourId, payload);

            let uploadedUrls = [];

            if (newImages.length > 0) {
                const uploadRes = await uploadImagesApi(newImages, "TOUR", editingTourId);

                uploadedUrls = (uploadRes?.data?.data || []).map((img) => img.imageUrl);
            }
            const oldUrls = existingImages.map((img) => img.imageUrl || img.url).filter(Boolean);
            const keptUrls = [...oldUrls, ...uploadedUrls];
            await syncTourImagesApi(editingTourId, "TOUR", keptUrls);

            toast.success(t("provider.tours.toastUpdateSuccess"));

            setTour(defaultTour);
            setDays(defaultDays);
            setEditingTourId(null);
            setExistingImages([]);
            setNewImages([]);
            setOpen(false);

            await loadTours();
        } catch (err) {
            toast.error(err?.response?.data?.message || t("provider.tours.toastUpdateFailed"));
        } finally {
            setLoading(false);
        }
    };
    const handleEdit = async (tour) => {
        if (services.length === 0) {
            toast.error(t("provider.tours.servicesLoading"));
            return;
        }
        const normalizedServices = (tour.availableServices || []).map((s, index, arr) => {
            const serviceId = s.serviceId?._id || s.serviceId;

            const serviceData = services.find((ser) => ser._id === serviceId) || s.serviceData || s.serviceId || null;

            return {
                ...s,
                serviceId,
                serviceData, // 🔥 luôn có data
                isDefault: s.isDefault ?? arr.filter((x) => x.type === s.type).findIndex((x) => x === s) === 0,
            };
        });

        setTour({
            ...tour,
            availableServices: normalizedServices,
        });

        setDays(mapTourToDays(tour, services));

        setExistingImages(
            (tour.images || []).map((img) => {
                if (typeof img === "string") return { imageUrl: img };
                if (img.imageUrl || img.url) return { imageUrl: img.imageUrl || img.url, _id: img._id };
                return { imageUrl: "", _id: img._id };
            }),
        );

        setNewImages([]);
        setEditingTourId(tour._id);
        setOpen(true);
    };
    const handleDelete = async (tour) => {
        try {
            const id = tour._id;
            await deleteTourById(id);
            await syncTourImagesApi(id, "TOUR", []);
            setTours((prev) => prev.filter((t) => t._id !== id));
            toast.success(t("provider.tours.toastDeleteSuccess"));
        } catch (err) {
            toast.error(err?.response?.data?.message || t("provider.tours.toastDeleteFailed"));
        }
    };
    const loadTours = async () => {
        try {
            setLoadingTours(true);
            const res = await getTours();
            setTours(res?.data?.data || []);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || t("provider.tours.toastLoadToursFailed"));
        } finally {
            setLoadingTours(false);
        }
    };
    const loadServices = async () => {
        setLoading(true);
        try {
            const res = await getServices();
            setServices(res?.data?.data || []);
        } catch (err) {
            console.error("Failed to load services", err);
            toast.error(err?.response?.data?.message || t("provider.tours.toastLoadServicesFailed"));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadServices();
        loadTours();
    }, []);
    return (
        <div className="space-y-6 text-on-surface sm:space-y-8">
            <section className="app-page-hero relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top_left,_rgba(0,104,95,0.16),_transparent_35%),linear-gradient(135deg,_#ffffff,_#eef7f5)] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)] dark:ring-white/10 sm:p-6 md:rounded-[2rem] md:p-8">
                <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                            {t("provider.tours.heroEyebrow")}
                        </p>
                        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl md:text-5xl">
                            {t("provider.tours.heroTitleA")}{" "}
                            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">{t("provider.tours.heroTitleB")}</span>
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant md:text-base">
                            {t("provider.tours.heroDescription")}
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center xl:w-auto">
                        <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest/85 px-4 py-3 shadow-sm ring-1 ring-outline-variant/25 backdrop-blur">
                            <Avatar size="lg" className="h-10 w-10">
                                <AvatarImage
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8R7F4kWyZXkBFYRNJ-5cTQabufPxmyzPYbMvhuuW0qOWkqSWA-LpIl7TaWMmC_7vatf2TetuAKpSW-aZK51As1jmjhlfp-IVQ4nGyfR_tjRlCNcrmlpVn_aRDJXiCD2Lac7x-jEz0I95CduYESBTiStix3ZYBa5lS00as3zthRvQpbiYVp_HJ1RmVkugRa-5fhn7VS_1HH5P6Fv8c9cCzp8W86O_4O4reI-xOvXjKG0LBFrcsO6dfW8kvBaip3YeExOFsHzmEDIw6"
                                    alt="Skyline Tours"
                                />
                                <AvatarFallback>ST</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-on-surface">{t("provider.tours.providerName")}</p>
                                <p className="text-xs font-medium text-on-surface-variant">{t("provider.tours.providerLabel")}</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleOpenDialog}
                            className="h-12 w-full rounded-2xl bg-gradient-to-br from-primary to-primary-container px-6 font-headline text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                        >
                            <Plus className="size-4" />
                            {t("provider.tours.createTour")}
                        </Button>
                    </div>
                </div>
            </section>
            <ManageToursStats />
            {loadingTours ? (
                <ManageToursTableSkeleton />
            ) : (
                <ManageToursTable tours={tours} handleDelete={handleDelete} handleEdit={handleEdit} />
            )}
            <DialogCreateTour
                open={open}
                onOpenChange={setOpen}
                tour={tour}
                setTour={setTour}
                services={services}
                handleClick={editingTourId ? handleUpdateTour : handleCreateTour}
                days={days}
                setDays={setDays}
                loading={loading}
                editingTourId={editingTourId}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                existingImages={existingImages}
                setExistingImages={setExistingImages}
                newImages={newImages}
                setNewImages={setNewImages}
            />
        </div>
    );
}

