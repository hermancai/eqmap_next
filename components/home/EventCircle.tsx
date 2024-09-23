"use client";

import {
    AdvancedMarker,
    AdvancedMarkerAnchorPoint,
} from "@vis.gl/react-google-maps";
import { EarthquakeData } from "@/types/USGS";
import { useMemo, useState } from "react";

type EventCircleProps = {
    data: EarthquakeData;
    isSelected: boolean;
    toggleSelectedRow: (id: EarthquakeData["id"]) => void;
    markerSize: number;
};

export default function EventCircle({
    data,
    toggleSelectedRow,
    isSelected,
    markerSize,
}: EventCircleProps) {
    const [openWindow, setOpenWindow] = useState(false);

    const position: google.maps.LatLngLiteral = {
        lat: data.geometry.coordinates[1],
        lng: data.geometry.coordinates[0],
    };

    return (
        <AdvancedMarker
            position={position}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
            onMouseEnter={() => setOpenWindow(true)}
            onMouseLeave={() => setOpenWindow(false)}
            onClick={() => toggleSelectedRow(data.id)}
            className="relative"
            zIndex={openWindow ? 10 : 0}
        >
            <CircleSVG
                isSelected={isSelected}
                mag={data.properties.mag}
                markerSize={markerSize}
            />
            {openWindow && (
                <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-[6px] bg-white rounded p-2 whitespace-nowrap shadow-[0px_2px_10px_1px_rgba(0,0,0,0.5)] pointer-events-none`}
                >
                    <p className="text-sm font-light">
                        {data.properties.place || "N/A"}
                        <br />
                        Magnitude: {data.properties.mag}
                        <br />
                        {new Date(data.properties.time).toLocaleString()}
                    </p>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-white" />
                </div>
            )}
        </AdvancedMarker>
    );
}

interface CircleSVGProps {
    isSelected: boolean;
    mag: number;
    markerSize: number;
}

function CircleSVG({ isSelected, mag, markerSize }: CircleSVGProps) {
    const scale = useMemo(
        () => Math.round(mag * markerSize * 2),
        [mag, markerSize]
    );

    return (
        <div
            style={{
                height: `${scale}px`,
                width: `${scale}px`,
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 22 22"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="11"
                    cy="11"
                    r="10"
                    fill={isSelected ? "green" : "red"}
                    fillOpacity={0.25}
                    stroke="white"
                    strokeWidth={0.25}
                    strokeOpacity={0.75}
                />
            </svg>
        </div>
    );
}
