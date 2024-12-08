import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { }

export function Textarea({ className, ...props }: TextareaProps) {
    return (
        <textarea
            className={`bg-gray-700 text-white border-none p-4 pr-20 rounded-lg focus:outline-none resize-none ${className}`}
            {...props}
        />
    );
}
