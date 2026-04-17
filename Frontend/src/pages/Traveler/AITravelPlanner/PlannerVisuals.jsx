import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import "mapbox-gl/dist/mapbox-gl.css";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const center = { lat: 16.047079, lng: 108.20623 };

function PlannerVisuals() {
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
                <Marker position={center} />
              </Map>
            </div>
          </APIProvider>
          <div className="pointer-events-none absolute inset-0 bg-primary/5" />
        </div>
      </Card>

      <Card className="group relative aspect-video overflow-hidden rounded-[2rem] border-none py-0 shadow-none">
        <img
          alt="Landscape"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYCXC5i2Kl9Sl5OfqGcXSSyg4bRbhovYNMdJD9PFLOTNVFpPvb-AsUQBOcSdrOF_DXCJVR2kEurTrwS58qw0NFpRs5fjZKhZK-6JTGUW_B5YIDa-BTFeWD404uE3Ao-EBQj5rvlrfaCqkMGy537kgK8Z6y65pEA5G2eiaGAoIPdrYvjZNa0q3g-T6WJXLMdleRW7yfg7tvGhyhNT_Ks7nSC4J9T7asyJRa2rBuyjD65T6_E_Wp8zjhNVuC1yXRendZ5o0wu2oPQQbr"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <CardContent className="absolute bottom-6 left-6 p-0">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
            Local Secret
          </p>
          <CardTitle className="text-xl font-bold text-white">
            The Sagano Scenic Railway
          </CardTitle>
          <CardDescription className="mt-1 text-[11px] italic text-white/80">
            Suggested: "The Sagano Scenic Railway is inserted as a low-stress
            connector between temple and food blocks."
          </CardDescription>
        </CardContent>
      </Card>
      <Card className="overflow-hidden rounded-[1.75rem] border-none bg-white py-0 shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                Weather Outlook
              </p>
              <CardTitle className="mt-2 text-xl font-extrabold text-on-surface">
                Plan Around the Forecast
              </CardTitle>
              <CardDescription className="mt-1 max-w-md text-xs leading-relaxed text-on-surface-variant">
                Check current conditions and switch between forecast days before
                locking the itinerary.
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PlannerVisuals;
