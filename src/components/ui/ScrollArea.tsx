import { ReactNode } from "react";

interface ScrollAreaProps {
    children: ReactNode;
}

export function ScrollArea({ children }: ScrollAreaProps) {
    return (
        <div className="overflow-y-auto flex-1">{children}</div>
    );
}
