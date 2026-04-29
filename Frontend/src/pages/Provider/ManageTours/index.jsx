import DialogCreateTour from "./DialogCreateTour";
import ManageToursStats from "./ManageToursStats";
import ManageToursTable from "./ManageToursTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getGuides } from "@/services/api/guide";
import { getServices } from "@/services/api/service";
import toast from "react-hot-toast";
import {
  createTour,
  deleteTourById,
  updateTourById,
} from "@/services/api/tour";
import { getTours } from "@/services/api/tour";
import { syncTourImagesApi, uploadImagesApi } from "@/services/api/image";
import PageHero from "@/components/shared/page-hero";
const defaultTour = {
  location: "",
  price: {
    adult: 0,
    child: 0,
    infant: 0,
  },
  numberOfDay: 1,
  maxSlots: 1,
  itineraries: [],
  hotelServiceId: "",
  transportServiceId: "",
  leadDuideServiceId: "",
  description: "",
  minSlots: 1,
  name: "",
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
  const [guides, setGuides] = useState([]);
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
        const service =
          services.find((s) => s._id === (a.serviceId?._id || a.serviceId)) ||
          {};

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
      activities: d.activities.map((a) => ({
        time: a.time,
        serviceId: a.serviceId,
        statusActivity: a.statusActivity,
      })),
    }));
  };
  const handleCreateTour = async () => {
    try {
      setLoading(true);
      const payload = {
        ...tour,
        itineraries: mapDaysToItineraries(days),
      };
      const res = await createTour(payload);
      const newTour = res?.data?.data;
      setTours((prev) => [newTour, ...prev]);
      if (newImages.length > 0) {
        await uploadImagesApi(newImages, "TOUR", newTour._id);
      }
      toast.success("Create tour successfully!");
      setTour(defaultTour);
      setDays(defaultDays);
      setExistingImages([]);
      setNewImages([]);
      setOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create tour failed!");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateTour = async () => {
    try {
      setLoading(true);

      const payload = {
        ...tour,
        itineraries: mapDaysToItineraries(days),
      };

      await updateTourById(editingTourId, payload);

      let uploadedUrls = [];

      if (newImages.length > 0) {
        const uploadRes = await uploadImagesApi(
          newImages,
          "TOUR",
          editingTourId,
        );

        uploadedUrls = (uploadRes?.data?.data || []).map((img) => img.imageUrl);
      }
      const oldUrls = existingImages
        .map((img) => img.imageUrl || img.url)
        .filter(Boolean);
      const keptUrls = [...oldUrls, ...uploadedUrls];
      await syncTourImagesApi(editingTourId, "TOUR", keptUrls);

      toast.success("Update tour successfully!");

      setTour(defaultTour);
      setDays(defaultDays);
      setEditingTourId(null);
      setExistingImages([]);
      setNewImages([]);
      setOpen(false);

      await loadTours();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (tour) => {
    setTour(tour);
    setDays(mapTourToDays(tour, services));
    setExistingImages(
      (tour.images || []).map((img) => {
        if (typeof img === "string") return { imageUrl: img };
        if (img.imageUrl || img.url)
          return { imageUrl: img.imageUrl || img.url, _id: img._id };
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
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };
  const loadTours = async () => {
    try {
      const res = await getTours();
      setTours(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tours");
    }
  };
  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await getServices();
      setServices(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load services", err);
      toast.error(
        err?.response?.data?.message ||
          "Unable to load services at the moment.",
      );
    } finally {
      setLoading(false);
    }
  };
  const loadGuides = async () => {
    try {
      const res = await getGuides();
      setGuides(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load guides", err);
    }
  };
  useEffect(() => {
    loadServices();
    loadGuides();
    loadTours();
  }, []);
  return (
    <div className="space-y-8 text-on-surface">
      <PageHero
        eyebrow="Inventory Overview"
        heading={
          <>
            Manage Your{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              Experiences
            </span>
          </>
        }
        description="Curate, update, and monitor your tour performance across global markets from a single editorial dashboard."
        showProviderCard
        actions={
          <Button
            onClick={handleOpenDialog}
            className="h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container px-6 font-headline text-sm font-bold text-on-primary shadow-lg shadow-primary/15"
          >
            <Plus className="size-4" />
            Create Tour
          </Button>
        }
      />
      <ManageToursStats />
      <ManageToursTable
        tours={tours}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      <DialogCreateTour
        open={open}
        onOpenChange={setOpen}
        tour={tour}
        setTour={setTour}
        services={services}
        handleClick={editingTourId ? handleUpdateTour : handleCreateTour}
        guides={guides}
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
