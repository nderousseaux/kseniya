// View of a group
import { Group } from '@/src/types';
import ItemCard from './ItemCard';

export default async function GroupCard(props: { group: Group }) {
  const { group: g } = props;

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-100 border border-gray-200/50 p-4 rounded-lg shadow-md backdrop-blur-sm min-w-[500px]">
      <h3 className="font-semibold text-lg mb-2">{g.name}</h3>
      {g.items && g.items.length > 0 && (
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 flex-1">
            {g.items
              .slice(0, Math.ceil(g.items.length / 3))
              .map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {g.items
              .slice(Math.ceil(g.items.length / 3), Math.ceil(g.items.length * 2 / 3))
              .map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {g.items
              .slice(Math.ceil(g.items.length * 2 / 3))
              .map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}