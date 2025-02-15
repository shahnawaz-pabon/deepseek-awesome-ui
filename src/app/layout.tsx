import "@/styles/globals.css";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}