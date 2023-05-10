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
import EventCircle from "./EventCircle";

type PinState = google.maps.Marker | null;
type CircleState = google.maps.Circle | null;
type MapState = google.maps.Map | null;
type MapProps = {
  pinPosition: google.maps.LatLngLiteral | null;
  setPinPosition: Dispatch<SetStateAction<google.maps.LatLngLiteral | null>>;
  searchedCenter: google.maps.LatLngLiteral | null;
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
const Map = ({
  pinPosition,
  setPinPosition,
  searchedCenter,
  searchRadius,
  data,
}: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY!,
  });

  const [map, setMap] = useState<MapState>(null);
  const [pin, setPin] = useState<PinState>(null);
  const [circle, setCircle] = useState<CircleState>(null);
  const [showPin, setShowPin] = useState<boolean>(true);

  const onMapLoad = useCallback(
    (map: MapState) => {
      if (map === null) return;
      setMap(map);
      setPinPosition(defaultCenter);
    },
    [setPinPosition]
  );

  const updatePinPosition = (e: google.maps.MapMouseEvent) => {
    if (e.latLng === null || !showPin) return;
    setPinPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  // Circle follows pin when pin is dragged.
  useEffect(() => {
    if (circle !== null && pin !== null) {
      pin.bindTo("position", circle, "center");
    }
  }, [circle, pin]);

  // Pan map to fit all data points
  useEffect(() => {
    if (map === null || data === null || searchedCenter === null) return;
    if (data.features.length === 0) return;

    const bounds = new google.maps.LatLngBounds(searchedCenter);
    data.features.forEach((entry) => {
      bounds.extend({
        lat: entry.geometry.coordinates[1],
        lng: entry.geometry.coordinates[0],
      });
    });
    map.fitBounds(bounds);
  }, [map, data, searchedCenter]);

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
            draggable={showPin}
            onMouseUp={updatePinPosition}
            onLoad={(p) => setPin(p)}
            opacity={showPin ? 1 : 0}
            clickable={showPin}
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
              visible={showPin}
            />
          </Marker>
          {data !== null && map !== null
            ? data.features.map((entry) => {
                return <EventCircle map={map} data={entry} key={entry.id} />;
              })
            : null}
          <div
            className="text-sm absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded px-2 py-1 whitespace-nowrap hover:cursor-pointer hover:text-orange-500 transition-colors duration-200"
            onClick={() => setShowPin(!showPin)}
          >
            {showPin ? "Hide" : "Show"} Pin
          </div>
        </>
      ) : null}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
