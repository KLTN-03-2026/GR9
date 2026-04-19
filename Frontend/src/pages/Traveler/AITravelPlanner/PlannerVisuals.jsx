import { Card } from "@/components/ui/card";

import "mapbox-gl/dist/mapbox-gl.css";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const center = { lat: 16.047079, lng: 108.20623 };

function PlannerVisuals({ itinerary, location }) {
  // const mapRef = useRef();
  // const mapContainerRef = useRef();
  // const markerRef = useRef();
  // const searchAddressFromCode = async (address) => {
  //   try {
  //     const res = await fetch(
  //       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
  //         address,
  //       )}.json?access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&country=vn&limit=1&language=vi,en&types=poi,place`,
  //     );

  //     const data = await res.json();
  //     const place = data.features?.[0];

  //     if (!place) {
  //       console.log("Không tìm thấy địa chỉ");
  //       return;
  //     }

  //     const [lng, lat] = place.center;
  //     mapRef.current.flyTo({
  //       center: [lng, lat],
  //       zoom: 15,
  //     });
  //     markerRef.current = new mapboxgl.Marker()
  //       .setLngLat([lng, lat])
  //       .addTo(mapRef.current);
  //     console.log("Địa chỉ:", place.place_name);
  //     console.log("Tọa độ:", { lng, lat });
  //   } catch (error) {
  //     console.error("Lỗi geocoding:", error);
  //   }
  // };
  // useEffect(() => {
  //   mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
  //   mapRef.current = new mapboxgl.Map({
  //     container: mapContainerRef.current,
  //     center: [108.2068, 16.0471],
  //     zoom: 11.75,
  //   });
  //   mapRef.current.on("load", () => {
  //     const address = "Linh Ung Pagoda, Da Nang";
  //     searchAddressFromCode(address);
  //   });
  //   return () => {
  //     mapRef.current.remove();
  //   };
  // }, []);

  if (!itinerary) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Card className="group relative rounded-[2rem] border-none bg-surface-container-lowest p-2 shadow-sm">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-slate-200">
          <APIProvider apiKey={import.meta.env.VITE_MAP_API_KEY}>
            <div style={{ width: "100%", height: "100%" }}>
              <Map
                defaultCenter={center}
                defaultZoom={13}
                gestureHandling="greedy"
                disableDefaultUI={false}
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
