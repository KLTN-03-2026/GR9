import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

import "mapbox-gl/dist/mapbox-gl.css";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const center = { lat: 16.047079, lng: 108.20623 };
const defaultZoom = 13;
const focusedZoom = 18;

function PlannerVisuals({ itinerary, location }) {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(defaultZoom);

  useEffect(() => {
    if (!location) {
      return;
    }
    setMapCenter(location);
    setMapZoom(focusedZoom);
  }, [location]);
  if (!itinerary) {
    return null;
  }

  return (
    <div className="space-y-8 xl:sticky xl:top-24 xl:self-start">
      <Card className="group relative rounded-[2rem] border border-outline-variant/15 bg-surface-container-lowest p-2 shadow-sm">
        <div className="relative h-[420px] overflow-hidden rounded-[1.75rem] bg-slate-200 xl:h-[560px]">
          <APIProvider apiKey={import.meta.env.VITE_MAP_API_KEY}>
            <div style={{ width: "100%", height: "100%" }}>
              <Map
                center={mapCenter}
                zoom={mapZoom}
                gestureHandling="greedy"
                disableDefaultUI={false}
                onCameraChanged={(event) => {
                  setMapCenter(event.detail.center);
                  setMapZoom(event.detail.zoom);
                }}
              >
                {location ? <Marker position={location} /> : null}
              </Map>
            </div>
          </APIProvider>
          <div className="pointer-events-none absolute inset-0 bg-primary/5" />
        </div>
      </Card>
    </div>
  );
}

export default PlannerVisuals;
