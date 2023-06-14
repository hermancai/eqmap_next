import { Marker, InfoWindow } from "@react-google-maps/api";
import { EarthquakeData } from "@/types/USGS";
import { useMemo, useState } from "react";

type EventCircleProps = {
  data: EarthquakeData;
  map: google.maps.Map;
  isSelected: boolean;
  toggleSelectedRow: (id: EarthquakeData["id"]) => void;
  markerSize: number;
};

const EventCircle = ({
  data,
  toggleSelectedRow,
  isSelected,
  markerSize,
}: EventCircleProps) => {
  const icon: google.maps.Symbol = useMemo(() => {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: data.properties.mag * markerSize,
      fillColor: isSelected ? "green" : "red",
      fillOpacity: 0.25,
      strokeColor: "white",
      strokeWeight: 0.5,
    };
  }, [data.properties.mag, isSelected, markerSize]);

  const [openWindow, setOpenWindow] = useState(false);

  return (
    <Marker
      position={{
        lat: data.geometry.coordinates[1],
        lng: data.geometry.coordinates[0],
      }}
      icon={icon}
      onMouseOver={() => {
        setOpenWindow(true);
      }}
      onMouseOut={() => {
        setOpenWindow(false);
      }}
      onClick={() => toggleSelectedRow(data.id)}
    >
      {openWindow && (
        <InfoWindow
          position={{
            lat: data.geometry.coordinates[1],
            lng: data.geometry.coordinates[0],
          }}
        >
          <p>
            {data.properties.place || "N/A"}
            <br />
            Magnitude: {data.properties.mag}
            <br />
            {new Date(data.properties.time).toLocaleString()}
          </p>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default EventCircle;
