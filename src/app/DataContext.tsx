import React, { createContext, useContext } from "react";

export type DataType = any;
export type DataContextType = {
  data: DataType;
  setData: (d: DataType) => void;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
