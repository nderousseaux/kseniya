// Quote

export default async function QuoteCard({ text }: { text: string }) {
  return (
    <div className="text-center min-w-80 max-w-96">
      <p className="text-gray-500 italic">{text}</p>
    </div>
  );
}