export function ScrollArea({ children }: { children: React.ReactNode }) {
    return <div className="overflow-y-auto h-full p-2">{children}</div>;
}
