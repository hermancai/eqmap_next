"use client";

import { useEffect } from "react";
import CheckboxInput from "./CheckboxInput";

interface DateInputProps {
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    validDates: boolean;
    setValidDates: React.Dispatch<React.SetStateAction<boolean>>;
    startDateChecked: boolean;
    setStartDateChecked: React.Dispatch<React.SetStateAction<boolean>>;
    endDateChecked: boolean;
    setEndDateChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DateInput({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    validDates,
    setValidDates,
    startDateChecked,
    setStartDateChecked,
    endDateChecked,
    setEndDateChecked,
}: DateInputProps) {
    const toggleStartDateChecked = () => {
        setStartDateChecked((prev) => !prev);
    };

    const toggleEndDateChecked = () => {
        setEndDateChecked((prev) => !prev);
    };

    const handleDateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setDate: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setDate(e.target.value);
    };

    // Date validation
    useEffect(() => {
        // Both checkboxes are checked
        if (startDateChecked && endDateChecked) {
            return setValidDates(true);
        }

        // If startDateChecked, endDate can be any valid date
        if (startDateChecked) {
            return setValidDates(endDate ? true : false);
        }

        // If endDateChecked, startDate must be before today
        if (endDateChecked) {
            // Comparing an Invalid Date will return false
            return setValidDates(new Date(startDate) < new Date());
        }

        // Neither checkbox is checked
        return setValidDates(new Date(startDate) < new Date(endDate));
    }, [startDate, endDate, startDateChecked, endDateChecked, setValidDates]);

    return (
        <>
            <div className="grid grid-rows-2 grid-cols-[auto_1fr_auto] w-full gap-y-1">
                <label htmlFor="startDate" className="w-min flex items-center">
                    Start
                </label>
                <StraightLineSpan checked={startDateChecked} />
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => handleDateChange(e, setStartDate)}
                    disabled={startDateChecked}
                    className={`form-input p-1 rounded border-2 transition-colors duration-200 ${
                        validDates ? "focus:border-slate-800" : "border-red-500"
                    }  outline-none outline-offset-0 w-[10rem] hover:cursor-pointer hover:border-slate-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-default disabled:border-gray-400`}
                />
                <BentLineSpan checked={startDateChecked} />
                <CheckboxInput
                    label="30 Days Before"
                    checked={startDateChecked}
                    handleOnChange={toggleStartDateChecked}
                />
            </div>

            <div className="grid grid-rows-2 grid-cols-[auto_1fr_auto] w-full gap-y-1">
                <label htmlFor="endDate" className="w-min flex items-center">
                    End
                </label>
                <StraightLineSpan checked={endDateChecked} />
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => handleDateChange(e, setEndDate)}
                    disabled={endDateChecked}
                    className={`form-input p-1 rounded border-2 transition-colors duration-200 ${
                        validDates ? "focus:border-slate-800" : "border-red-500"
                    }  outline-none outline-offset-0 w-[10rem] hover:cursor-pointer hover:border-slate-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-default disabled:border-gray-400`}
                />
                <BentLineSpan checked={endDateChecked} />
                <CheckboxInput
                    label="Current Time"
                    checked={endDateChecked}
                    handleOnChange={toggleEndDateChecked}
                />
            </div>
        </>
    );
}

interface LineSpanProps {
    checked: boolean;
}

function StraightLineSpan({ checked }: LineSpanProps) {
    return (
        <div className="w-full h-full relative">
            <span
                className={`absolute h-[2px] top-1/2 inset-x-4 transition-colors ${
                    checked ? "bg-slate-300" : "bg-slate-900"
                }`}
            />
        </div>
    );
}

function BentLineSpan({ checked }: LineSpanProps) {
    return (
        <>
            <div className="w-full h-full relative">
                <span
                    className={`absolute h-1/2 w-[2px] top-0 left-1/2 transition-colors ${
                        checked ? "bg-slate-900" : "bg-slate-300"
                    }`}
                />
                <span
                    className={`absolute h-[2px] w-1/2 top-1/2 left-1/2 transition-colors ${
                        checked ? "bg-slate-900" : "bg-slate-300"
                    }`}
                />
            </div>

            <div className="w-full h-full relative">
                <span
                    className={`absolute h-[2px] top-1/2 left-0 right-4 transition-colors ${
                        checked ? "bg-slate-900" : "bg-slate-300"
                    }`}
                />
            </div>
        </>
    );
}
