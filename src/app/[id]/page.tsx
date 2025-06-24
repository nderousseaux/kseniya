// View of a board
import InfiniteCanvas from "@/src/components/InfiniteCanvas";
import Board from "@/src/components/Board";

export default async function Page(props: {params: Promise<{id: string}>}) {
  const params = await props.params;
  const id = params.id;
  
  return (
    <InfiniteCanvas>
      <Board id={id} />
    </InfiniteCanvas>
  );
}