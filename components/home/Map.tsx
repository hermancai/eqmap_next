import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

type Map = google.maps.Map | null;

const API_KEY = process.env.NEXT_PUBLIC_MAP_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
} as React.CSSProperties;

const defaultCenter = {
  lat: 37.77,
  lng: -122.42,
} as google.maps.LatLngLiteral;

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY!,
  });

  const [map, setMap] = useState<Map>(null);
  const [pinPosition, setPinPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  const onLoad = useCallback((map: Map) => {
    if (map === null) return;
    setMap(map);
    setPinPosition(defaultCenter);
  }, []);

  const onUnmount = useCallback((map: Map) => {
    setMap(null);
  }, []);

  const updatePinPosition = (e: google.maps.MapMouseEvent) => {
    if (e.latLng === null) return;
    setPinPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={3}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={updatePinPosition}
    >
      {pinPosition !== null ? (
        <Marker
          position={pinPosition}
          draggable
          onMouseUp={updatePinPosition}
        />
      ) : null}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
