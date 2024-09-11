"use client";

interface CheckboxInputProps {
    label: string;
    checked: boolean;
    handleOnChange: () => void;
}

export default function CheckboxInput({
    label,
    checked,
    handleOnChange,
}: CheckboxInputProps) {
    return (
        <label
            className={`flex flex-nowrap items-center cursor-pointer gap-2 ${
                checked ? "" : "text-gray-500"
            }`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={handleOnChange}
                className="form-checkbox cursor-pointer text-slate-700 rounded w-5 h-5"
            />
            {label}
        </label>
    );
}
