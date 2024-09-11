"use client";

import Slider from "@mui/material/Slider";

interface MagnitudeSliderProps {
    magnitudeValues: [number, number];
    setMagnitudeValues: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const MIN_MAGNITUDE_RANGE = 0.1;

export default function MagnitudeSlider({
    magnitudeValues,
    setMagnitudeValues,
}: MagnitudeSliderProps) {
    const handleMagnitudeChange = (
        e: Event,
        newValue: number | number[],
        activeThumb: number
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setMagnitudeValues([
                Math.min(newValue[0], magnitudeValues[1] - MIN_MAGNITUDE_RANGE),
                magnitudeValues[1],
            ]);
        } else {
            setMagnitudeValues([
                magnitudeValues[0],
                Math.max(newValue[1], magnitudeValues[0] + MIN_MAGNITUDE_RANGE),
            ]);
        }
    };

    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex justify-between">
                <p>Magnitude Range</p>
                <p>
                    {magnitudeValues[0].toFixed(1)} -{" "}
                    {magnitudeValues[1].toFixed(1)}
                </p>
            </div>
            <Slider
                value={magnitudeValues}
                onChange={handleMagnitudeChange}
                min={0}
                max={10}
                step={0.1}
                sx={{
                    color: "#1e293b",
                    height: "7px",
                }}
                getAriaLabel={() => "magnitude-range-slider"}
            />
        </div>
    );
}
