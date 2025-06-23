import BoardList, { BoardListSkeleton } from '@/src/components/BoardList';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Boards</h1>
        <p className="text-gray-600">Manage your boards and organize your content</p>
      </div>
      <Suspense fallback={<BoardListSkeleton />}>
        <BoardList />
      </Suspense>
    </div>
  );
}
