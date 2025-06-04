import Image from "next/image";

export default function Item({ item }: { item: { name: string; description: string; img?: string } }) {
  return (
    <div className="border-solid border-2 border-green-500 p-4 rounded-lg w-48 bg-white">
      {item.img && (
      <div className="w-full mb-2">
        <Image
          src={item.img}
          alt={item.name}
          width={192}
          height={192}
          className="w-full h-auto max-h-full object-contain rounded"
          style={{ display: "block" }}
        />
      </div>
      )}
      <h2 className="text-xl font-bold">{item.name}</h2>
      <p>{item.description}</p>
    </div>
  );
}