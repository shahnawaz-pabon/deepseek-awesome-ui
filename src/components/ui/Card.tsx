export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`p-4 border rounded-lg shadow-sm bg-white ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children }: { children: React.ReactNode }) {
    return <div className="p-3">{children}</div>;
}
