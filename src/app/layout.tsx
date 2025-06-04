'use client';
import "@/src/ui/global.css";

import React, { useState, useEffect } from "react";
import dataJson from "@/src/lib/data.json";
import { DataContext, DataType } from "@/src/lib/DataContext";

// Main layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DataType | undefined>(undefined);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("appData");
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData(dataJson);
    }
  }, []);

  // Save to localStorage on data change
  useEffect(() => {
    localStorage.setItem("appData", JSON.stringify(data));
  }, [data]);

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