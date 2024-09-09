"use client";

import Slider from "@mui/material/Slider";

interface RadiusSliderProps {
    searchRadius: number;
    setSearchRadius: React.Dispatch<React.SetStateAction<number>>;
}

const MIN_RADIUS = 100;
const MAX_RADIUS = 20000;
const STEP_RADIUS = 0.01;

export default function RadiusSlider({
    searchRadius,
    setSearchRadius,
}: RadiusSliderProps) {
    const handleSearchRadiusChange = (
        e: Event,
        newValue: number | number[],
        activeThumb: number
    ) => {
        setSearchRadius(
            Math.round(Math.pow(10, newValue as number) / 100) * 100
        );
    };

    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex justify-between">
                <label>Search Radius</label>
                <p>{`${searchRadius} km (${Math.round(
                    searchRadius / 1.609
                )} mi)`}</p>
            </div>
            <Slider
                value={Math.log10(searchRadius)}
                onChange={handleSearchRadiusChange}
                min={Math.log10(MIN_RADIUS)}
                max={Math.log10(MAX_RADIUS)}
                step={STEP_RADIUS}
                scale={(x) => 10 ** x}
                sx={{
                    color: "#1e293b",
                    height: "7px",
                }}
                getAriaLabel={() => "search-radius-slider"}
            />
        </div>
    );
}
