import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import PlannerItinerary from "./PlannerItinerary";
import PlannerResultHeader from "./PlannerResultHeader";
import PlannerSidebar from "./PlannerSidebar";
import PlannerVisuals from "./PlannerVisuals";
import { callAi, saveAiTourHistory } from "@/services/api/ai";
import { geocodeAddress } from "@/services/api/location";

const extractJson = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Response is empty or invalid");
  }

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON found in response");
  }

  return JSON.parse(match[0]);
};

export default function AITravelPlanner() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [destination, setDestination] = useState("Kyoto, Japan");
  const [startDate, setStartDate] = useState(null);
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("1500");
  const [location, setLocation] = useState(null);
  const [describe, setDescribe] = useState(null);
  const [quantity, setQuantity] = useState({
    adult: 2,
    child: 1,
    infant: 0,
  });
  const [itinerary, setItinerary] = useState(null);
  const [savingTrip, setSavingTrip] = useState(false);
  const [savedTripId, setSavedTripId] = useState(null);

  useEffect(() => {
    const selectedTour = routeLocation.state?.selectedTour;
    if (!selectedTour) return;

    setItinerary(selectedTour);
    setSavedTripId(selectedTour._id || null);
    setDestination(selectedTour.location || "");
    setDuration(selectedTour.numberOfDay || 3);
    setBudget(
      String(
        (Number(selectedTour.price?.ADULT) || 0) +
          (Number(selectedTour.price?.CHILD) || 0) +
          (Number(selectedTour.price?.INFANT) || 0),
      ),
    );
    setDescribe(selectedTour.description || "");
    setQuantity({
      adult: Number(selectedTour.quantity?.ADULT) || 0,
      child: Number(selectedTour.quantity?.CHILD) || 0,
      infant: Number(selectedTour.quantity?.INFANT) || 0,
    });

    if (selectedTour.startDay) {
      setStartDate(new Date(selectedTour.startDay));
    }
  }, [routeLocation.state]);

  const handleChangeDuration = (value) => {
    setDuration(Number(value));
  };

  const handleChangeCompanion = (role, value) => {
    setQuantity((prev) => ({
      ...prev,
      [role]: Math.max(Number(value) || 0, 0),
    }));
  };

  const handleChangeStartDate = (value) => {
    if (!value) {
      setStartDate(null);
      return;
    }

    const [year, month, day] = value.split("-").map(Number);
    setStartDate(new Date(Date.UTC(year, month - 1, day)));
  };

  const handleGenerateTour = async () => {
    const bookablePeople =
      (Number(quantity.adult) || 0) + (Number(quantity.child) || 0);

    if (bookablePeople < 5) {
      toast.error("Vui lòng chọn tổng số người lớn và trẻ em ít nhất 5 người");
      return;
    }

    try {
      const payload = {
        destination,
        startDate: startDate?.toISOString() ?? null,
        budget: Number(budget) || 0,
        describe,
        duration,
        quantity,
      };

      const response = await callAi(payload);
      const data = extractJson(response.data.data);
      setItinerary(data);
      setSavedTripId(null);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Cannot generate tour");
    }
  };

  const handleSaveTrip = async () => {
    if (!itinerary) {
      toast.error("Please generate a trip before saving");
      return;
    }

    if (savedTripId) {
      toast.success("This trip is already saved");
      return;
    }

    try {
      setSavingTrip(true);
      const response = await saveAiTourHistory({
        tour: itinerary,
      });
      setSavedTripId(response.data.data?._id);
      toast.success("Trip saved to AI Tour History");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Cannot save trip");
    } finally {
      setSavingTrip(false);
    }
  };

  const handleGetLatLng = async (address) => {
    try {
      const response = await geocodeAddress(address);
      const { lat, lng } = response.data.data;

      setLocation({ lat, lng });
      console.log("LAT LNG:", location);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="bg-surface">
      <div className="flex h-screen pt-16">
        <main className="flex flex-1 overflow-hidden">
          <PlannerSidebar
            budget={budget}
            quantity={quantity}
            destination={destination}
            duration={duration}
            handleGenerateTour={handleGenerateTour}
            onBudgetChange={setBudget}
            onCompanionChange={handleChangeCompanion}
            onDestinationChange={setDestination}
            onDurationChange={handleChangeDuration}
            onStartDateChange={handleChangeStartDate}
            setDescribe={setDescribe}
            startDate={startDate}
            describe={describe}
          />

          <section
            className={`scrollbar-hide relative h-full flex-1 overflow-y-auto ${
              itinerary
                ? "bg-surface px-6 pb-12 pt-24 md:px-10 xl:flex xl:flex-col xl:overflow-y-auto"
                : "bg-black/5 p-0"
            }`}
          >
            <PlannerResultHeader
              itinerary={itinerary}
              isTripSaved={Boolean(savedTripId)}
              isSavingTrip={savingTrip}
              onOpenHistory={() => navigate("/traveler/ai-tour-history")}
              onSaveTrip={handleSaveTrip}
            />

            {itinerary ? (
              <>
                <div className="grid grid-cols-1 gap-10 xl:min-h-0 xl:flex-1 xl:grid-cols-2">
                  <PlannerItinerary
                    itinerary={itinerary}
                    handleGetLatLng={handleGetLatLng}
                  />
                  <PlannerVisuals itinerary={itinerary} location={location} />
                </div>

                <div className="h-20" />
              </>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}
