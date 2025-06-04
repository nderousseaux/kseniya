"use client";
import React from "react";
import { useData } from "@/src/lib/DataContext";
import Editor from "@/src/ui/components/Editor";

export default function EditPage() {
  const { data, setData } = useData();

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span>Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Editor data={data} setData={setData} />
    </div>
  );
}
