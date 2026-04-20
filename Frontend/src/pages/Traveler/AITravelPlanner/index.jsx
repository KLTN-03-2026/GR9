import { useState } from "react";
import PlannerItinerary from "./PlannerItinerary";
import PlannerResultHeader from "./PlannerResultHeader";
import PlannerSidebar from "./PlannerSidebar";
import PlannerVisuals from "./PlannerVisuals";
import { callAi } from "@/services/api/ai";
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
  const [destination, setDestination] = useState("Kyoto, Japan");
  const [startDate, setStartDate] = useState(null);
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("1500");
  const [location, setLocation] = useState(null);
  const [travelStyles, setTravelStyles] = useState({
    relax: false,
    adventure: true,
    food: true,
    culture: false,
  });
  const [quantity, setQuantity] = useState({
    adult: 2,
    child: 1,
    infant: 0,
  });
  const [itinerary, setItinerary] = useState(null);

  const handleToggleTravelStyle = (styleKey) => {
    setTravelStyles((prev) => ({
      ...prev,
      [styleKey]: !prev[styleKey],
    }));
  };

  const handleChangeDuration = (value) => {
    setDuration(Number(value));
  };

  const handleChangeCompanion = (role, value) => {
    setQuantity((prev) => ({
      ...prev,
      [role]: Number(value),
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
    try {
      console.log({
        destination,
        startDate: startDate?.toISOString() ?? null,
        budget: Number(budget) || 0,
        travelStyles,
        duration,
        quantity,
      });

      const response = await callAi({
        destination,
        startDate: startDate?.toISOString() ?? null,
        budget: Number(budget) || 0,
        travelStyles,
        duration,
        quantity,
      });
      console.log(response);
      const data = extractJson(response.data.data);
      setItinerary(data);
      console.log(data);
    } catch (error) {
      console.log(error);
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
    <div>
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
            startDate={startDate}
            onToggleTravelStyle={handleToggleTravelStyle}
            travelStyles={travelStyles}
          />

          <section
            className={`scrollbar-hide relative h-full flex-1 overflow-y-auto ${
              itinerary
                ? "bg-surface p-8 xl:flex xl:flex-col xl:overflow-y-auto"
                : "bg-black/5 p-0"
            }`}
          >
            <PlannerResultHeader itinerary={itinerary} />

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
