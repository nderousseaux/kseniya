"use client";
import React from "react";
import { useData } from "@/src/lib/DataContext";
import Center from "@/src/ui/components/Center";
import Group from "@/src/ui/components/Group";
import InfiniteCanvas from "@/src/ui/components/InfiniteCanvas";
import Editor from "@/src/ui/components/Editor";



// Root page
export default function Page() {
  const { data, setData } = useData();

  // Show loader if data is not loaded yet
  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fafafa] z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // If not on /edit, render main content only
  if (typeof window !== "undefined" && window.location.pathname !== "/edit") {
    const { title, description } = data;
    const groups = data.groups || [];
    return (
      <InfiniteCanvas>
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <>
              <Center 
                title={title}
                desciption={description}
              />
              {groups[0] && (
                <div className="absolute -top-6 -right-48 translate-y-[-100%] translate-x-[-100%]">
                <Group group={groups[0]} index={0} />
                </div>
              )}
              {groups[1] && (
                <div className="absolute top-24 left-4 translate-y-[-100%] translate-x-[100%]">
                <Group group={groups[1]} index={1} />
                </div>
              )}
              {groups[2] && (
                <div className="absolute bottom-10 right-0 translate-y-[100%] translate-x-[-100%]">
                <Group group={groups[2]} index={2} />
                </div>
              )}
              {groups[3] && (
                <div className="absolute -bottom-6 -left-32 translate-y-[100%] translate-x-[100%]">
                <Group group={groups[3]} index={3} />
                </div>
              )}
            </>
          </div>
        </div>
      </InfiniteCanvas>
    );
  }

  // If on /edit, render only the editor overlay
  return (
    <div className="fixed top-4 right-4 z-50 shadow-lg rounded-lg bg-white border border-gray-200">
      <Editor data={data} setData={setData} />
    </div>
  );
}