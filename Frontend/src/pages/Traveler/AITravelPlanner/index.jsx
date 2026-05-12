import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import PlannerItinerary from "./PlannerItinerary";
import PlannerResultHeader from "./PlannerResultHeader";
import PlannerSidebar from "./PlannerSidebar";
import PlannerVisuals from "./PlannerVisuals";
import { callAi, publishAiTourRequest, saveAiTourHistory } from "@/services/api/ai";
import { geocodeAddress } from "@/services/api/location";
import { useI18n } from "@/i18n/I18nProvider";

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

const getGenerateErrorMessage = (error, t) => {
  const status = error?.response?.status;
  const message = String(error?.response?.data?.message || error?.message || "");

  if (
    status === 429 ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.toLowerCase().includes("quota") ||
    message.toLowerCase().includes("rate limit")
  ) {
    return t("planner.quotaError");
  }

  if (
    message.includes("API_KEY_INVALID") ||
    message.toLowerCase().includes("api key")
  ) {
    return t("planner.apiKeyError");
  }

  if (message.toLowerCase().includes("json")) {
    return t("planner.invalidJsonError");
  }

  return t("planner.genericGenerateError");
};

function PlannerGeneratingState({ destination, duration }) {
  const { t } = useI18n();
  const displayDestination = destination || t("planner.fallbackDestination");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl items-center justify-center px-4 py-16">
      <div className="w-full rounded-[2rem] border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="size-4" />
              {t("planner.generatingBadge")}
            </div>
            <h2 className="font-heading text-3xl font-extrabold leading-tight text-on-surface md:text-5xl">
              {t("planner.generatingTitle", { duration, destination: displayDestination })}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-on-surface-variant">
              {t("planner.generatingDescription")}
            </p>
          </div>

          <div className="flex min-w-[220px] flex-col items-center rounded-[1.75rem] bg-surface-container-low p-6">
            <Loader2 className="size-12 animate-spin text-primary" />
            <p className="mt-4 text-sm font-bold text-on-surface">{t("planner.processing")}</p>
            <p className="mt-1 text-center text-xs text-on-surface-variant">
              {t("planner.processingHint")}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[t("planner.analyzeRequest"), t("planner.chooseActivities"), t("planner.optimizeBudget")].map((label, index) => (
            <div
              key={label}
              className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-4"
            >
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full animate-pulse rounded-full bg-primary"
                  style={{ width: `${58 + index * 14}%` }}
                />
              </div>
              <p className="text-sm font-bold text-on-surface">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlannerErrorState({ message, onRetry }) {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-4xl items-center justify-center px-4 py-16">
      <div className="rounded-[2rem] border border-amber-300/30 bg-amber-50 p-8 text-amber-950 shadow-sm dark:bg-amber-400/10 dark:text-amber-100 md:p-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15">
          <span className="material-symbols-outlined text-amber-600">info</span>
        </div>
        <h2 className="font-heading text-2xl font-extrabold">{t("planner.cannotGenerateTitle")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <RefreshCw className="size-4" />
          {t("planner.retryGenerate")}
        </button>
      </div>
    </div>
  );
}

export default function AITravelPlanner() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { t } = useI18n();
  const resultSectionRef = useRef(null);
  const [destination, setDestination] = useState("Kyoto, Japan");
  const [startDate, setStartDate] = useState(null);
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("5000000");
  const [location, setLocation] = useState(null);
  const [describe, setDescribe] = useState(null);
  const [quantity, setQuantity] = useState({
    adult: 2,
    child: 1,
    infant: 0,
  });
  const [itinerary, setItinerary] = useState(null);
  const [savingTrip, setSavingTrip] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [sendingToProviders, setSendingToProviders] = useState(false);
  const [sentToProviders, setSentToProviders] = useState(false);
  const [savedTripId, setSavedTripId] = useState(null);

  useEffect(() => {
    if (!isGenerating && !itinerary && !generateError) return undefined;

    let secondFrameId;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.innerWidth >= 1280) {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) window.cancelAnimationFrame(secondFrameId);
    };
  }, [isGenerating, itinerary, generateError]);

  useEffect(() => {
    const selectedTour = routeLocation.state?.selectedTour;
    if (!selectedTour) return;

    setItinerary(selectedTour);
    setSavedTripId(selectedTour._id || null);
    setSentToProviders(
      ["PUBLISHED", "PROPOSED", "APPROVED", "REJECTED", "CONVERTED"].includes(selectedTour.status),
    );
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
      setIsGenerating(true);
      setGenerateError("");

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
      setSentToProviders(false);
    } catch (error) {
      console.log(error);
      const friendlyMessage = getGenerateErrorMessage(error, t);
      setGenerateError(friendlyMessage);
      toast.error(friendlyMessage);
    } finally {
      setIsGenerating(false);
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
      const savedTour = response.data.data;
      setSavedTripId(savedTour?._id);
      if (savedTour) {
        setItinerary(savedTour);
      }
      toast.success("Trip saved to AI Tour History");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Cannot save trip");
    } finally {
      setSavingTrip(false);
    }
  };

  const ensureSavedTrip = async () => {
    if (savedTripId) return savedTripId;
    if (!itinerary) {
      toast.error("Please generate a trip first");
      return null;
    }

    const response = await saveAiTourHistory({ tour: itinerary });
    const savedTour = response.data.data;
    const id = savedTour?._id;
    setSavedTripId(id);
    if (savedTour) {
      setItinerary(savedTour);
    }
    return id;
  };

  const handleSendToProviders = async () => {
    try {
      setSendingToProviders(true);
      const requestId = await ensureSavedTrip();
      if (!requestId) return;

      await publishAiTourRequest(requestId);
      setSentToProviders(true);
      toast.success("Đã gửi tour AI đến toàn bộ provider");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Không thể gửi tour AI đến provider");
    } finally {
      setSendingToProviders(false);
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
      <div className="min-h-[calc(100vh-5rem)]">
        <main className="flex min-h-[calc(100vh-5rem)] flex-1 flex-col overflow-visible xl:flex-row">
          <PlannerSidebar
            budget={budget}
            isGenerating={isGenerating}
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
            ref={resultSectionRef}
            className={`relative min-h-[calc(100vh-5rem)] flex-1 overflow-visible ${
              itinerary || isGenerating || generateError
                ? "bg-surface px-4 pb-12 pt-6 md:px-8 xl:flex xl:flex-col"
                : "bg-black/5 p-0"
            }`}
          >
            {isGenerating ? (
              <PlannerGeneratingState destination={destination} duration={duration} />
            ) : generateError && !itinerary ? (
              <PlannerErrorState message={generateError} onRetry={handleGenerateTour} />
            ) : (
              <>
                <PlannerResultHeader
                  itinerary={itinerary}
                  isTripSaved={Boolean(savedTripId)}
                  isSavingTrip={savingTrip}
                  isSendingToProviders={sendingToProviders}
                  isSentToProviders={sentToProviders}
                  onOpenHistory={() => navigate("/traveler/ai-tour-history")}
                  onSendToProviders={handleSendToProviders}
                  onSaveTrip={handleSaveTrip}
                />

                {generateError && itinerary ? (
                  <div className="mx-auto mb-6 w-full max-w-7xl rounded-2xl border border-amber-300/25 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
                    {generateError}
                  </div>
                ) : null}

                {itinerary ? (
                  <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
                    <PlannerItinerary
                      itinerary={itinerary}
                      handleGetLatLng={handleGetLatLng}
                    />
                    <PlannerVisuals itinerary={itinerary} location={location} />
                  </div>
                ) : null}

                {itinerary ? <div className="h-20" /> : null}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
