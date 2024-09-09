"use client";

import { useEffect } from "react";
import { getClientTodayISOString } from "@/services/date";

interface DateInputProps {
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    validDates: boolean;
    setValidDates: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DateInput({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    validDates,
    setValidDates,
}: DateInputProps) {
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

    const handleDateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setDate: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setDate(e.target.value);
    };

    return (
        <>
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
        </>
    );
}
