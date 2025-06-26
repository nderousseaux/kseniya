// Edit view of a board - reuses the parent page component
import { notFound } from "next/navigation";
import Page from "@/src/app/[id]/page";
import EditPanel from "@/src/components/Edit/EditPanel";
import { board } from "@/src/services";

export default async function EditPage(props: {params: Promise<{id: string}>}) {
  const id = (await props.params).id;
  
  // Get board data with all related objects for the edit panel
  const boardData = await board.getById(id, { 
    include: { 
      groups: { include: { items: true } }, 
      quotes: true 
    } 
  });
  
  if (!boardData) {
    notFound();
  }

  return (
    <>
      <div className="absolute top-5 right-5 p-4 z-10 bg-white border border-gray-300 rounded-lg shadow-lg">
        <EditPanel boardData={boardData} />
      </div>
      <Page params={props.params} />
    </>
  )
}
