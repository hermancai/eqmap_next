import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

type Map = google.maps.Map | null;

const API_KEY = process.env.NEXT_PUBLIC_MAP_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 37.77,
  lng: -122.42,
};

export default function Home() {
  if (API_KEY === undefined) {
    return <div>Missing Google Maps API Key</div>;
  }

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  const [map, setMap] = React.useState<Map>(null);

  const onLoad = React.useCallback((map: Map) => {
    if (map === null) return;
    setMap(map);
  }, []);

  const onUnmount = React.useCallback((map: Map) => {
    setMap(null);
  }, []);

  return (
    <main className="flex flex-col md:flex-row">
      <div className="md:w-[24rem] md:h-screen flex flex-col items-center py-8 px-4 bg-slate-100">
        <h1>EARTHQUAKE MAP</h1>
        <div></div>
      </div>
      <div className="grow h-[75vh] md:h-screen">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={3}
            onLoad={onLoad}
            onUnmount={onUnmount}
          ></GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
