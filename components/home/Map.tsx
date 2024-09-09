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
import { EarthquakeData, USGSData } from "@/types/USGS";
import EventCircle from "./EventCircle";
import { SelectedRows } from "@/app/page";

type PinState = google.maps.Marker | null;
type CircleState = google.maps.Circle | null;
type MapState = google.maps.Map | null;
type MapProps = {
    pinPosition: google.maps.LatLngLiteral | null;
    setPinPosition: Dispatch<SetStateAction<google.maps.LatLngLiteral | null>>;
    searchedCenter: google.maps.LatLngLiteral | null;
    searchRadius: number;
    data: USGSData | null;
    selectedRows: SelectedRows;
    toggleSelectedRow: (id: EarthquakeData["id"]) => void;
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
    selectedRows,
    toggleSelectedRow,
}: MapProps) => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: API_KEY!,
    });

    const [map, setMap] = useState<MapState>(null);
    const [pin, setPin] = useState<PinState>(null);
    const [circle, setCircle] = useState<CircleState>(null);
    const [showPin, setShowPin] = useState<boolean>(true);
    const [markerSize, setMarkerSize] = useState<number>(3);

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
                              return (
                                  <EventCircle
                                      map={map}
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
                            <div className="flex flex-row gap-2 shadow-sm shadow-black bg-slate-800 rounded px-2 py-1 justify-center items-center whitespace-nowrap">
                                <label htmlFor="select-marker-size">
                                    Marker Size:
                                </label>
                                <select
                                    value={markerSize}
                                    className="bg-slate-800 cursor-pointer hover:text-orange-500 transition-colors duration-200"
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
                            </div>
                        ) : null}
                    </div>
                </>
            ) : null}
        </GoogleMap>
    ) : (
        <></>
    );
};

export default Map;
