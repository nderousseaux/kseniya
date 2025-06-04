import { createContext, useContext } from "react";

export type ItemType = {
  name: string;
  description: string;
  img?: string;
};

export type GroupType = {
  name: string;
  quote?: string;
  items: ItemType[];
};

export type DataType = {
  title: string;
  description: string;
  groups: GroupType[];
};

export type DataContextType = {
  data: DataType | undefined;
  setData: (d: DataType) => void;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
