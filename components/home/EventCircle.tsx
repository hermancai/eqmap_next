import { Marker } from "@react-google-maps/api";
import { EarthquakeData } from "@/types/USGS";
import { useMemo } from "react";

type EventCircleProps = {
  data: EarthquakeData;
  map: google.maps.Map;
  isSelected: boolean;
  toggleSelectedRow: (id: EarthquakeData["id"]) => void;
};

const EventCircle = ({
  data,
  map,
  toggleSelectedRow,
  isSelected,
}: EventCircleProps) => {
  const icon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: data.properties.mag * 5,
    fillColor: isSelected ? "green" : "red",
    fillOpacity: 0.25,
    strokeColor: "white",
    strokeWeight: 0.5,
  };

  const infoWindow = useMemo(() => {
    return new google.maps.InfoWindow({
      content: `<p>${data.properties.place || "N/A"}<br>Magnitude: ${
        data.properties.mag
      }<br>${new Date(data.properties.time).toLocaleString()}</p>`,
      position: {
        lat: data.geometry.coordinates[1],
        lng: data.geometry.coordinates[0],
      },
      pixelOffset: new google.maps.Size(0, data.properties.mag * -5),
    });
  }, [data]);

  return (
    <Marker
      position={{
        lat: data.geometry.coordinates[1],
        lng: data.geometry.coordinates[0],
      }}
      icon={icon}
      onMouseOver={() => infoWindow.open({ map: map })}
      onMouseOut={() => infoWindow.close()}
      onClick={() => toggleSelectedRow(data.id)}
    />
  );
};

export default EventCircle;
