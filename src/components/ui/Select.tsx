import { ReactNode } from "react";

interface SelectProps {
    children: ReactNode;
    onChange: (value: string) => void;
    value: string;
}

export function Select({ children, value, onChange }: SelectProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-gray-700 text-white border-none p-2 rounded-lg"
        >
            {children}
        </select>
    );
}
