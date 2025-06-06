"use client";
import React from "react";
import { useData } from "../../lib/DataContext";
import Center from "../../ui/components/Center";
import Group from "../../ui/components/Group";
import InfiniteCanvas from "../../ui/components/InfiniteCanvas";
import Editor from "../../ui/components/Editor";

export default function EditPage() {
  const { data, setData } = useData();
  const [authenticated, setAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const editPassword = process.env.NEXT_PUBLIC_EDIT_PASSWORD || "admin";

  // Password protection
  if (!authenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fafafa] z-50">
        <div className="bg-white p-8 rounded shadow-lg flex flex-col items-center border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Enter Password</h2>
          <input
            type="password"
            className="border p-2 mb-4 w-64"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (password === editPassword) {
                  setAuthenticated(true);
                  setError("");
                } else {
                  setError("Incorrect password");
                }
              }
            }}
            autoFocus
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              if (password === editPassword) {
                setAuthenticated(true);
                setError("");
              } else {
                setError("Incorrect password");
              }
            }}
          >
            Submit
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fafafa] z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  const { title, description } = data;
  const groups = data.groups || [];

  return (
    <>
      <InfiniteCanvas>
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <Center title={title} desciption={description} />
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
          </div>
        </div>
      </InfiniteCanvas>
      <div className="fixed top-4 right-4 z-50 shadow-lg rounded-lg bg-white border border-gray-200">
        <Editor data={data} setData={setData} />
      </div>
    </>
  );
}
