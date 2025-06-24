// View of a board
import { Board } from '@/src/types';
import { board } from '@/src/services';

export default async function BoardCard(props: { id: string }) {
  const { id } = props;

  const b: Board | null = await board.getById(id);
  if (!b) throw new Error(`Board with id ${id} not found`);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800">{b.title}</h1>
    </>
  );
}
