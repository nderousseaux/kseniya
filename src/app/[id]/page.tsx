// View of a board
import { notFound } from "next/navigation";
import InfiniteCanvas from "@/src/components/InfiniteCanvas";
import BoardCard from "@/src/components/Board/BoardCard";
import { board } from "@/src/services";

export default async function Page(props: {params: Promise<{id: string}>}) {
  const id = (await props.params).id;
  
  // Vérifier si le board existe
  const b = await board.getById(id);
  if (!b) {
    notFound();
  }
  
  return (
    <InfiniteCanvas>
      <BoardCard id={id} />
    </InfiniteCanvas>
  );
}