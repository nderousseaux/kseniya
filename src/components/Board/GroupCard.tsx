// View of a group
import { Group } from '@/src/types';

export default async function GroupCard(props: { group: Group }) {
  const { group: g } = props;

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-100 border border-gray-200/50 p-4 rounded-lg shadow-md backdrop-blur-sm w-fit">
      <p>{g.name}</p>
    </div>
  );
}