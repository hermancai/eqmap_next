import Slider from "@mui/material/Slider";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

const minMagnitudeRange = 0.1;

// Handles timezone offset from UTC. Returns yyyy-mm-dd
const getClientDateISOString = () => {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .substring(0, 10);
};

const SearchForm = () => {
  // Dates in yyyy/mm/dd format
  const [startDate, setStartDate] = useState<string>("1900-01-01");
  const [endDate, setEndDate] = useState<string>(getClientDateISOString());
  const [magnitudeValues, setMagnitudeValues] = useState<[number, number]>([
    8, 10,
  ]);
  const [searchRadius, setSearchRadius] = useState<number>(10000);
  const [results, setResults] = useState<number>(100);

  const handleDateChange = (
    e: ChangeEvent<HTMLInputElement>,
    setDate: Dispatch<SetStateAction<string>>
  ) => {
    setDate(e.target.value);
  };

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
        Math.min(newValue[0], magnitudeValues[1] - minMagnitudeRange),
        magnitudeValues[1],
      ]);
    } else {
      setMagnitudeValues([
        magnitudeValues[0],
        Math.max(newValue[1], magnitudeValues[0] + minMagnitudeRange),
      ]);
    }
  };

  const handleSearchRadiusChange = (
    e: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    setSearchRadius(newValue as number);
  };

  const handleResultsChange = (
    e: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    setResults(newValue as number);
  };

  return (
    <div className="md:w-[24rem] md:h-screen flex flex-col items-center p-8 bg-slate-100 gap-8 overflow-auto">
      <h1 className="text-4xl text-center tracking-wide">EARTHQUAKE MAP</h1>
      <div className="w-full flex justify-between items-center gap-3">
        <label htmlFor="startDate">Start</label>
        <span className="relative h-full grow border-t-[1px] border-slate-300 top-1/2" />
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => handleDateChange(e, setStartDate)}
          className="p-1 rounded border border-slate-300 focus:outline-slate-900 outline-none outline-offset-0 w-[10rem] hover:cursor-pointer"
        />
      </div>
      <div className="w-full flex justify-between items-center gap-3">
        <label htmlFor="endDate">End</label>
        <span className="relative h-full grow border-t-[1px] border-slate-300 top-1/2" />
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => handleDateChange(e, setEndDate)}
          className="p-1 rounded border border-slate-300 focus:outline-slate-900 outline-none outline-offset-0 w-[10rem] hover:cursor-pointer"
        />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between">
          <label>Magnitude Range</label>
          <p>
            {magnitudeValues[0].toFixed(1)} - {magnitudeValues[1].toFixed(1)}
          </p>
        </div>
        <Slider
          value={magnitudeValues}
          onChange={handleMagnitudeChange}
          disableSwap
          min={0}
          max={10}
          step={0.1}
          sx={{
            color: "#1e293b",
            height: "7px",
          }}
        />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between">
          <label>Search Radius</label>
          <p>{searchRadius} km</p>
        </div>
        <Slider
          value={searchRadius}
          onChange={handleSearchRadiusChange}
          min={100}
          max={20000}
          step={100}
          disableSwap
          sx={{
            color: "#1e293b",
            height: "7px",
          }}
        />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between">
          <label>Results</label>
          <p>{results}</p>
        </div>
        <Slider
          value={results}
          onChange={handleResultsChange}
          min={10}
          max={1000}
          step={10}
          disableSwap
          sx={{
            color: "#1e293b",
            height: "7px",
          }}
        />
      </div>
      <button className="text-white bg-slate-800 py-2 px-4 rounded hover:scale-105">
        SEARCH
      </button>
    </div>
  );
};

export default SearchForm;
