import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from "@react-google-maps/api";
import { USGSData } from "@/types/USGS";

type PinState = google.maps.Marker | null;
type CircleState = google.maps.Circle | null;
type MapState = google.maps.Map | null;
type MapProps = {
  pinPosition: google.maps.LatLngLiteral | null;
  setPinPosition: Dispatch<SetStateAction<google.maps.LatLngLiteral | null>>;
  searchRadius: number;
  data: USGSData | null;
};

const API_KEY = process.env.NEXT_PUBLIC_MAP_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
} as React.CSSProperties;

const defaultCenter = {
  lat: 38.46,
  lng: -144.56,
} as google.maps.LatLngLiteral;

// NOTE: Two circles are rendered in strict mode.
const Map = ({ pinPosition, setPinPosition, searchRadius, data }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY!,
  });

  const [map, setMap] = useState<MapState>(null);
  const [pin, setPin] = useState<PinState>(null);
  const [circle, setCircle] = useState<CircleState>(null);

  const onMapLoad = useCallback(
    (map: MapState) => {
      if (map === null) return;
      setMap(map);
      setPinPosition(defaultCenter);
    },
    [setPinPosition]
  );

  const updatePinPosition = (e: google.maps.MapMouseEvent) => {
    if (e.latLng === null) return;
    setPinPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  // Circle follows pin when pin is dragged.
  useEffect(() => {
    if (circle !== null && pin !== null) {
      pin.bindTo("position", circle, "center");
    }
  }, [circle, pin]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={3}
      onLoad={onMapLoad}
      onClick={updatePinPosition}
    >
      {pinPosition !== null ? (
        <>
          <Marker
            position={pinPosition}
            draggable
            onMouseUp={updatePinPosition}
            onLoad={(p) => setPin(p)}
          >
            <Circle
              center={pinPosition}
              radius={searchRadius * 1000}
              options={{
                clickable: false,
                fillOpacity: 0.1,
                strokeWeight: 1,
                strokeOpacity: 0.5,
              }}
              onLoad={(c) => setCircle(c)}
            />
          </Marker>
          {data !== null ? (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white border-2 border-slate-800 rounded px-4 py-2">
              {data.features.length} Earthquakes Found
            </div>
          ) : null}
        </>
      ) : null}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
