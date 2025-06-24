// View of a board
import { Board } from '@/src/types';
import { board } from '@/src/services';

import Title from './Title';

export default async function BoardCard(props: { id: string }) {
  const { id } = props;

  const b: Board | null = await board.getById(id);
  if (!b) throw new Error(`Board with id ${id} not found`);

  return (
    <>
      <Title title={b.title} description={b.description} />
    </>
  );
}
