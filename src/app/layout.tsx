'use client';
import "@/src/ui/global.css";

import React, { useState, useEffect } from "react";
import { DataContext, DataType } from "@/src/lib/DataContext";

// Main layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DataType | undefined>(undefined);

  // Fetch from API on mount
  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  return (
    <html>
      <body className="antialiased">
        <DataContext.Provider value={{ data, setData }}>
          {children}
        </DataContext.Provider>
      </body>
    </html>
  );
}