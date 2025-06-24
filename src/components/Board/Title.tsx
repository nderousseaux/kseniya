// Center of a board with title and description
export default async function Title({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-100 border border-gray-200/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm w-fit">
      <h1
        className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 w-fit"
        style={{ userSelect: 'text' }}
      >
        {title}
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
    </div>
  );
}