// View of a board

export default async function Board(props: { id: string }) {
  const { id } = props;
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800">Board ID: {id}</h1>
    </>
  );
}
