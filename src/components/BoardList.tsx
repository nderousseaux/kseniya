import Link from 'next/link';

import { Board } from '@/src/types';
import { board } from '@/src/services';

export default async function BoardList() {
  const boards: Board[] = await board.getAll();
  
  return (
    <div className="space-y-4">
      {boards.map((board) => (
      <div key={board.id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
      <div>
      <h2 className="text-xl font-semibold text-gray-900">{board.title} <span className="text-gray-400 text-sm">#{board.id}</span></h2>
      <p className="text-gray-600">{board.description}</p>
      </div>
      <div className="flex space-x-2">
      <Link href={`/${board.id}`} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-block text-center no-underline">
        Go to Board
      </Link>
      <button className="px-3 py-1 text-gray-600 text-sm hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
        Edit Form
      </button>
      </div>
      </div>
      ))}

      <div className="mt-8 text-center">
      <p className="text-sm text-gray-500">
      Boards found: <span className="font-medium">{boards.length}</span>
      </p>
      </div>      
    </div>
  );
}

export function BoardListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 bg-gray-200 animate-pulse rounded-lg">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}