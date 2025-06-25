// View of a board
import { Board } from '@/src/types';
import { board } from '@/src/services';

import GroupCard from './GroupCard';
import Title from './Title';

export default async function BordCard(props: { id: string }) {
  const { id } = props;

  const b: Board | null = await board.getById(id, { include: { groups: { include: { items: true } } } });
  if (!b) throw new Error('Board not found');

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">  
        <Title title={b.title} description={b.description} />
        {b.groups?.map((group) => (
          <div 
            key={group.id} 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${group.posX}px, ${group.posY}px)`
            }}
          >
            <GroupCard key={group.id} group={group} />
          </div>
        ))}
      </div>
    </div>
  );
}
