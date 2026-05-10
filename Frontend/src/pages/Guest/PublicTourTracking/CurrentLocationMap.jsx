import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { geocodeAddress } from "@/services/api/location";

const CurrentLocationMap = ({ tracking }) => {
  const [mapQuery, setMapQuery] = useState("");

  const target = useMemo(() => {
    const activities = tracking?.today?.activities || [];
    const activity =
      activities.find((item) => item.state === "ongoing") ||
      tracking?.progress?.nextActivity ||
      activities.find((item) => item.address || item.name) ||
      null;

    return {
      activity,
      query:
        activity?.address ||
        [activity?.name, tracking?.tour?.location].filter(Boolean).join(", ") ||
        tracking?.tour?.location ||
        "",
    };
  }, [tracking]);

  useEffect(() => {
    let ignore = false;

    const resolveLocation = async () => {
      if (!target.query) {
        setMapQuery("");
        return;
      }

      if (target.activity?.lat && target.activity?.long) {
        setMapQuery(`${target.activity.lat},${target.activity.long}`);
        return;
      }

      try {
        const response = await geocodeAddress(target.query);
        const location = response.data?.data;

        if (!ignore && location?.lat && location?.lng) {
          setMapQuery(`${location.lat},${location.lng}`);
        } else if (!ignore) {
          setMapQuery(target.query);
        }
      } catch {
        if (!ignore) setMapQuery(target.query);
      }
    };

    resolveLocation();

    return () => {
      ignore = true;
    };
  }, [target]);

  const mapSrc = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`
    : "";

  return (
    <Card className="rounded-3xl overflow-hidden shadow-sm aspect-video md:h-[400px] relative border-none bg-slate-200">
      <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-xl flex items-center gap-3 border border-white/20 shadow-lg">
        <MapPin className="w-5 h-5 text-teal-600" />
        <span className="text-sm font-bold text-slate-800 tracking-tight">
          Current Location: {target.activity?.name || tracking?.tour?.location || "Tour location"}
        </span>
      </div>
      {mapSrc ? (
        <iframe
          title="Public tour tracking map"
          className="h-full w-full border-0"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
          Map location is not available
        </div>
      )}
    </Card>
  );
};

export default CurrentLocationMap;
