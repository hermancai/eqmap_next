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
                    className={`p-1 rounded border-2 transition-colors duration-200 ${
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
                    className={`p-1 rounded border-2 transition-colors duration-200 ${
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
        <span
            className={`relative h-full border-b-[2px] bottom-1/2 mx-4 transition-colors ${
                checked ? "border-slate-300" : "border-slate-900"
            }`}
        />
    );
}

function BentLineSpan({ checked }: LineSpanProps) {
    return (
        <>
            <span
                className={`relative h-1/2 w-1/2 border-b-[2px] border-l-[2px] left-1/2 transition-colors ${
                    checked ? "border-slate-900" : "border-slate-300"
                }`}
            />
            <span
                className={`relative h-full border-b-[2px] bottom-1/2 mr-4 transition-colors ${
                    checked ? "border-slate-900" : "border-slate-300"
                }`}
            />
        </>
    );
}
