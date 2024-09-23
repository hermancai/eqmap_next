import {
    Map,
    AdvancedMarker,
    useMap,
    Pin,
    MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { Circle } from "./Circle";
import { USGSData, EarthquakeData } from "@/types/USGS";
import { SelectedRows } from "@/types/data";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import EventCircle from "./EventCircle";

const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;

type GoogleMapProps = {
    pinPosition: google.maps.LatLngLiteral;
    setPinPosition: Dispatch<SetStateAction<google.maps.LatLngLiteral>>;
    searchedCenter: google.maps.LatLngLiteral | null;
    searchRadius: number;
    data: USGSData | null;
    selectedRows: SelectedRows;
    toggleSelectedRow: (id: EarthquakeData["id"]) => void;
};

export default function GoogleMap({
    pinPosition,
    setPinPosition,
    searchedCenter,
    searchRadius,
    data,
    selectedRows,
    toggleSelectedRow,
}: GoogleMapProps) {
    const map = useMap();
    const [showPin, setShowPin] = useState<boolean>(true);
    const [markerSize, setMarkerSize] = useState<number>(3);

    const handleMapClick = (e: MapMouseEvent) => {
        if (showPin && e.detail.latLng) {
            setPinPosition(e.detail.latLng);
        }
    };

    const updatePinPostion = (e: google.maps.MapMouseEvent) => {
        if (showPin && e.latLng) {
            setPinPosition(e.latLng.toJSON());
        }
    };

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

    return (
        <Map
            reuseMaps={true}
            defaultCenter={pinPosition}
            defaultZoom={3}
            mapId={MAP_ID!}
            onClick={handleMapClick}
        >
            {pinPosition !== null ? (
                <>
                    <AdvancedMarker
                        position={pinPosition}
                        draggable={showPin}
                        onDrag={updatePinPostion}
                        className={`${showPin ? "opacity-100" : "opacity-0"}`}
                    >
                        <Pin />
                        <Circle
                            radius={searchRadius * 1000}
                            center={pinPosition}
                            clickable={false}
                            fillOpacity={0.1}
                            strokeWeight={1}
                            strokeOpacity={0.5}
                            visible={showPin}
                        />
                    </AdvancedMarker>
                    {data !== null
                        ? data.features.map((entry) => {
                              return (
                                  <EventCircle
                                      data={entry}
                                      key={entry.id}
                                      toggleSelectedRow={toggleSelectedRow}
                                      isSelected={selectedRows[entry.id]}
                                      markerSize={markerSize}
                                  />
                              );
                          })
                        : null}
                    <div className="flex flex-row gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white">
                        <div
                            className="shadow-sm shadow-black bg-slate-800 rounded px-2 py-1 hover:cursor-pointer hover:text-orange-500 transition-colors duration-200 flex justify-center items-center whitespace-nowrap"
                            onClick={() => setShowPin(!showPin)}
                        >
                            {showPin ? "Hide" : "Show"} Pin
                        </div>
                        {data !== null && data.features.length > 0 ? (
                            <label
                                htmlFor="select-marker-size"
                                className="relative hover:text-orange-500 transition-colors whitespace-nowrap shadow-sm shadow-black bg-slate-800 rounded px-2 py-1"
                            >
                                Marker Size: {markerSize}
                                <select
                                    value={markerSize}
                                    className="absolute top-0 left-0 w-full h-full opacity-0 bg-slate-800 cursor-pointer [direction:rtl]"
                                    id="select-marker-size"
                                    onChange={(e) =>
                                        setMarkerSize(Number(e.target.value))
                                    }
                                >
                                    {[0, 1, 2, 3, 4, 5].map((val) => {
                                        return (
                                            <option
                                                key={val}
                                                value={val}
                                                className="text-white"
                                            >
                                                {val}
                                            </option>
                                        );
                                    })}
                                </select>
                            </label>
                        ) : null}
                    </div>
                </>
            ) : null}
        </Map>
    );
}
