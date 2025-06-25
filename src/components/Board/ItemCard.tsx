// View of an individual item
import { z } from 'zod';
import Image from 'next/image';
import { ItemSchema } from '@/src/services/item';

type Item = z.infer<typeof ItemSchema>;

export default function ItemCard(props: { item: Item }) {
  const { item } = props;

  return (
    <div className="bg-white p-3 rounded border border-gray-100 shadow-sm min-w-32">
      <h4 className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis" title={item.name}>
        {item.name}
      </h4>
      {item.image && (
        <div className="mt-2 mb-2">
          <Image 
            src={`data:image/jpeg;base64,${Buffer.from(item.image).toString('base64')}`}
            alt={item.name}
            width={128}
            height={80}
            className="w-full h-20 object-cover rounded"
          />
        </div>
      )}
      {item.description && (
        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
      )}
    </div>
  );
}
