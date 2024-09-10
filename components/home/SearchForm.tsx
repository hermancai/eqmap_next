"use client";

import { useState } from "react";
import { fetchData } from "@/services/USGS";
import { USGSData } from "@/types/USGS";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import DateInput from "./DateInput";
import MagnitudeSlider from "./MagnitudeSlider";
import RadiusSlider from "./RadiusSlider";
import ResultSlider from "./ResultSlider";
import AboutSection from "./AboutSection";

type SearchFormProps = {
    searchRadius: number;
    setSearchRadius: React.Dispatch<React.SetStateAction<number>>;
    setSearchedCenter: React.Dispatch<
        React.SetStateAction<google.maps.LatLngLiteral | null>
    >;
    pinPosition: google.maps.LatLngLiteral | null;
    data: USGSData | null;
    setData: React.Dispatch<React.SetStateAction<USGSData | null>>;
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
    const [endDate, setEndDate] = useState<string>("2020-01-01");
    const [startDateChecked, setStartDateChecked] = useState<boolean>(false);
    const [endDateChecked, setEndDateChecked] = useState<boolean>(true);
    const [validDates, setValidDates] = useState<boolean>(true);
    const [magnitudeValues, setMagnitudeValues] = useState<[number, number]>([
        7.5, 10,
    ]);
    const [results, setResults] = useState<number>(50);

    const [loading, setLoading] = useState<boolean>(false);
    const [longLoad, setLongLoad] = useState<boolean>(false);
    const [showAboutSection, setShowAboutSection] = useState<boolean>(false);

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
                startDateChecked,
                endDateChecked,
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

    return (
        <div className="md:w-[24rem] md:min-h-screen flex flex-col items-center p-8 bg-slate-100 gap-8 overflow-hidden relative">
            <h1 className="text-4xl text-center tracking-wide">
                EARTHQUAKE MAP
            </h1>
            <p className="text-center">
                Choose a location by clicking on the map.
            </p>
            <DateInput
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                validDates={validDates}
                setValidDates={setValidDates}
                startDateChecked={startDateChecked}
                setStartDateChecked={setStartDateChecked}
                endDateChecked={endDateChecked}
                setEndDateChecked={setEndDateChecked}
            />
            <MagnitudeSlider
                magnitudeValues={magnitudeValues}
                setMagnitudeValues={setMagnitudeValues}
            />
            <RadiusSlider
                searchRadius={searchRadius}
                setSearchRadius={setSearchRadius}
            />
            <ResultSlider results={results} setResults={setResults} />
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
                            This may take some time depending on your search
                            terms.
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
                        <p className="text-lg">{`${
                            data.features.length
                        } Earthquake${
                            data.features.length === 1 ? "" : "s"
                        } Found`}</p>
                        {data.features.length > 1 ? (
                            <p className="text-sm text-gray-500">
                                Scroll for more data
                            </p>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
            <QuestionMarkCircleIcon
                className="h-7 self-end mt-auto text-slate-500 cursor-pointer hover:text-slate-800 transition-colors duration-200"
                onClick={() => setShowAboutSection(!showAboutSection)}
            />
            <AboutSection
                show={showAboutSection}
                setShow={setShowAboutSection}
            />
        </div>
    );
};

export default SearchForm;
