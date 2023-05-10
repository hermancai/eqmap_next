import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Slider from "@mui/material/Slider";
import { fetchData } from "@/services/USGS";
import { USGSData } from "@/types/USGS";
import { motion, AnimatePresence } from "framer-motion";

const minMagnitudeRange = 0.1;

type SearchFormProps = {
  searchRadius: number;
  setSearchRadius: Dispatch<SetStateAction<number>>;
  setSearchedCenter: Dispatch<SetStateAction<google.maps.LatLngLiteral | null>>;
  pinPosition: google.maps.LatLngLiteral | null;
  data: USGSData | null;
  setData: Dispatch<SetStateAction<USGSData | null>>;
};

// Handles timezone offset from UTC. Returns yyyy-mm-dd
const getClientTodayISOString = () => {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .substring(0, 10);
};

const SearchForm = ({
  searchRadius,
  setSearchRadius,
  setSearchedCenter,
  pinPosition,
  data,
  setData,
}: SearchFormProps) => {
  // Dates in yyyy/mm/dd format
  const [startDate, setStartDate] = useState<string>("1900-01-01");
  const [endDate, setEndDate] = useState<string>(getClientTodayISOString());
  const [magnitudeValues, setMagnitudeValues] = useState<[number, number]>([
    7.5, 10,
  ]);
  const [results, setResults] = useState<number>(100);
  const [validDates, setValidDates] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [longLoad, setLongLoad] = useState<boolean>(false);

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

  const handleSearch = async () => {
    if (!validDates || pinPosition === null) {
      return;
    }

    setLoading(true);
    setData(null);
    const timeoutId = setTimeout(() => {
      setLongLoad(true);
    }, 3000);

    try {
      const data = await fetchData({
        lat: pinPosition.lat,
        lng: pinPosition.lng,
        startDate,
        endDate,
        minMag: magnitudeValues[0],
        maxMag: magnitudeValues[1],
        searchRadius,
        resultLimit: results,
      });
      setSearchedCenter(pinPosition);
      clearTimeout(timeoutId);
      setLongLoad(false);
      // Wait for long load message exit transition
      setTimeout(() => {
        setData(data);
      }, 300);
    } catch {
      alert("An error occurred while communicating with USGS.");
      clearTimeout(timeoutId);
      setLongLoad(false);
    } finally {
      setLoading(false);
    }
  };

  // Date validation
  useEffect(() => {
    if (!startDate || !endDate) {
      return setValidDates(false); // Missing dates
    }

    const start = new Date(startDate);
    if (start > new Date(endDate)) {
      return setValidDates(false); // Start greater than end
    }

    const today = new Date(getClientTodayISOString());
    if (start >= today) {
      return setValidDates(false); // Start greater than today
    }

    if (startDate === endDate) {
      return setValidDates(false); // Equal dates
    }

    setValidDates(true);
  }, [startDate, endDate]);

  return (
    <div className="md:w-[24rem] md:h-screen flex flex-col items-center p-8 bg-slate-100 gap-8 overflow-auto">
      <h1 className="text-4xl text-center tracking-wide">EARTHQUAKE MAP</h1>
      <p className="text-center">Choose a location by clicking on the map.</p>
      <div className="w-full flex justify-between items-center gap-3">
        <label htmlFor="startDate">Start</label>
        <span className="relative h-full grow border-t-[1px] border-slate-300 top-1/2" />
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => handleDateChange(e, setStartDate)}
          className={`p-1 rounded border-2 border-gray-400 ${
            validDates ? "focus:border-slate-800" : "border-red-500"
          }  outline-none outline-offset-0 w-[10rem] hover:cursor-pointer hover:border-slate-800 transition-colors duration-200`}
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
          className={`p-1 rounded border-2 border-gray-400 ${
            validDates ? "focus:border-slate-800" : "border-red-500"
          } outline-none outline-offset-0 w-[10rem] hover:cursor-pointer hover:border-slate-800 transition-colors duration-200`}
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
          sx={{
            color: "#1e293b",
            height: "7px",
          }}
        />
      </div>
      <button
        className="shadow-sm shadow-gray-500 w-24 h-10 text-white bg-slate-800 py-2 px-4 rounded disabled:bg-slate-500 flex justify-center items-center hover:text-orange-400 transition-colors duration-200"
        onClick={handleSearch}
        disabled={!validDates || loading}
      >
        {loading ? (
          <div className="h-6 w-6 border-4 border-t-4 border-slate-500 border-t-slate-800 border-b-slate-800 animate-spin rounded-full" />
        ) : (
          "SEARCH"
        )}
      </button>
      <div className="w-full">
        <AnimatePresence>
          {longLoad && (
            <motion.div
              className="text-center w-full p-2 border-4 border-yellow-300 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>Gathering data...</p>
              <p className="text-sm text-gray-500">
                This may take some time depending on your search terms.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {data !== null && (
            <motion.div
              className="text-center w-full p-2 border-4 border-green-500 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg">{`${data.features.length} Earthquake${
                data.features.length === 1 ? "" : "s"
              } Found`}</p>
              {data.features.length > 1 ? (
                <p className="text-sm text-gray-500">Scroll for more data</p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchForm;
