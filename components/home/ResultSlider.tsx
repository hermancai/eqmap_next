"use client";

import Slider from "@mui/material/Slider";

interface ResultSliderProps {
    results: number;
    setResults: React.Dispatch<React.SetStateAction<number>>;
}

const MIN_RESULTS = 10;
const MAX_RESULTS = 1000;
const STEP_RESULTS = 0.01;

export default function ResultSlider({
    results,
    setResults,
}: ResultSliderProps) {
    const handleResultsChange = (
        e: Event,
        newValue: number | number[],
        activeThumb: number
    ) => {
        setResults(Math.round(Math.pow(10, newValue as number) / 10) * 10);
    };

    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex justify-between">
                <label>Results</label>
                <p>{results}</p>
            </div>
            <Slider
                value={Math.log10(results)}
                onChange={handleResultsChange}
                min={Math.log10(MIN_RESULTS)}
                max={Math.log10(MAX_RESULTS)}
                step={STEP_RESULTS}
                scale={(x) => 10 ** x}
                sx={{
                    color: "#1e293b",
                    height: "7px",
                }}
                getAriaLabel={() => "result-limit-slider"}
            />
        </div>
    );
}
