import React from "react";
import { DataType, GroupType, ItemType } from "@/src/lib/DataContext";

export default function Editor({ data, setData }: { data: DataType | undefined; setData: (d: DataType) => void }) {
  const [editPassword, setEditPassword] = React.useState(data?.password || "");

  if (!data) {
    return <div>Chargement des données...</div>;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, title: e.target.value });
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, description: e.target.value });
  };

  const handleGroupChange = (idx: number, field: keyof GroupType, value: string) => {
    const groups = [...(data.groups || [])];
    groups[idx] = { ...groups[idx], [field]: value };
    setData({ ...data, groups });
  };

  const handleItemChange = (groupIdx: number, itemIdx: number, field: keyof ItemType, value: string) => {
    const groups = [...(data.groups || [])];
    const items = [...(groups[groupIdx]?.items || [])];
    items[itemIdx] = { ...items[itemIdx], [field]: value };
    groups[groupIdx] = { ...groups[groupIdx], items };
    setData({ ...data, groups });
  };

  const addGroup = () => {
    setData({
      ...data,
      groups: [...(data.groups || []), { name: "", quote: "", items: [] }]
    });
  };

  const deleteGroup = (groupIdx: number) => {
    const groups = [...(data.groups || [])];
    groups.splice(groupIdx, 1);
    setData({ ...data, groups });
  };

  const addItem = (groupIdx: number) => {
    const groups = [...(data.groups || [])];
    groups[groupIdx] = {
      ...groups[groupIdx],
      items: [...(groups[groupIdx].items || []), { name: "", description: "", img: "" }]
    };
    setData({ ...data, groups });
  };

  const deleteItem = (groupIdx: number, itemIdx: number) => {
    const groups = [...(data.groups || [])];
    const items = [...(groups[groupIdx]?.items || [])];
    items.splice(itemIdx, 1);
    groups[groupIdx] = { ...groups[groupIdx], items };
    setData({ ...data, groups });
  };

  const saveToDb = async () => {
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, password: editPassword }),
    });
    alert("Data saved to database!");
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Edit Page</h2>
      <div className="mb-4">
        <label className="block font-semibold">Title</label>
        <input className="border p-2 w-full" value={data.title} onChange={handleTitleChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Description</label>
        <input className="border p-2 w-full" value={data.description} onChange={handleDescriptionChange} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Groups</label>
        <button className="ml-2 px-2 py-1 bg-blue-200 rounded" onClick={addGroup} type="button">Add Group</button>
        {(data.groups || []).map((group: GroupType, groupIdx: number) => (
          <div key={groupIdx} className="border p-2 my-2 rounded">
            <div className="flex items-center mb-2">
              <input
                className="border p-1 mr-2"
                placeholder="Group Name"
                value={group.name}
                onChange={e => handleGroupChange(groupIdx, "name", e.target.value)}
              />
              <input
                className="border p-1 mr-2"
                placeholder="Group Quote"
                value={group.quote || ""}
                onChange={e => handleGroupChange(groupIdx, "quote", e.target.value)}
              />
              <button
                className="ml-2 px-2 py-1 bg-red-200 rounded text-red-700 hover:bg-red-300"
                type="button"
                onClick={() => deleteGroup(groupIdx)}
              >
                Delete Group
              </button>
            </div>
            <div className="ml-4">
              <label className="font-semibold">Items</label>
              <button className="ml-2 px-2 py-1 bg-green-200 rounded" onClick={() => addItem(groupIdx)} type="button">Add Item</button>
              {(group.items || []).map((item: ItemType, itemIdx: number) => (
                <div key={itemIdx} className="flex gap-2 my-1 items-center">
                  <input
                    className="border p-1"
                    placeholder="Name"
                    value={item.name}
                    onChange={e => handleItemChange(groupIdx, itemIdx, "name", e.target.value)}
                  />
                  <input
                    className="border p-1"
                    placeholder="Description"
                    value={item.description}
                    onChange={e => handleItemChange(groupIdx, itemIdx, "description", e.target.value)}
                  />
                  <input
                    className="border p-1"
                    placeholder="Image URL"
                    value={item.img || ""}
                    onChange={e => handleItemChange(groupIdx, itemIdx, "img", e.target.value)}
                  />
                  <button
                    className="ml-2 px-2 py-1 bg-red-100 rounded text-red-700 hover:bg-red-300"
                    type="button"
                    onClick={() => deleteItem(groupIdx, itemIdx)}
                  >
                    Delete Item
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Edit Password</label>
        <input
          className="border p-2 w-full"
          type="password"
          value={editPassword}
          onChange={e => setEditPassword(e.target.value)}
        />
      </div>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" type="button" onClick={saveToDb}>
        Save to Database
      </button>
    </div>
  );
}
