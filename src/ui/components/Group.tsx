import Item from "@/src/ui/components/Item";

export default function Group({ group, index }: { group?: { name: string; quote?: string; items: { name: string; description: string; img?: string }[] } | null; index?: number }) {
  return (
    <>
      {index === 3 && group?.quote && (
        <div className="w-full bg-blue-50 border border-blue-300 rounded p-4 mb-4 shadow text-blue-900 text-sm">
          <span className="italic">"{group.quote}"</span>
        </div>
      )}
      <div className="border-solid border-2 border-red-500 p-4 rounded-lg w-fit bg-white relative">
        {/* Show quote outside, at right, only for index 0 */}
        {index === 0 && group?.quote && (
          <div className="absolute -right-4 bottom-0 translate-y-[-100%] translate-x-[100%] w-60 bg-blue-50 border border-blue-300 rounded p-4 shadow text-blue-900 text-sm">
            <span className="italic">"{group.quote}"</span>
          </div>
        )}
        {index === 1 && group?.quote && (
          <div className="absolute -right-4 bottom-0 translate-y-[-100%] translate-x-[100%] w-60 bg-blue-50 border border-blue-300 rounded p-4 shadow text-blue-900 text-sm">
            <span className="italic">"{group.quote}"</span>
          </div>
        )}
        {index === 2 && group?.quote && (
          <div className="absolute -right-4 top-0 translate-y-[100%] translate-x-[100%] w-60 bg-blue-50 border border-blue-300 rounded p-4 shadow text-blue-900 text-sm">
            <span className="italic">"{group.quote}"</span>
          </div>
        )}
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            {group?.items.slice(0, Math.ceil((group.items.length || 0) / 3)).map((item, index) => (
              <Item key={index} item={item} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {group?.items
              .slice(
                Math.ceil((group.items.length || 0) / 3),
                Math.ceil((group.items.length || 0) * 2 / 3)
              )
              .map((item, index, arr) => (
                <>
                  {index === arr.length - 1 && (
                    <div key="group-name" className="text-lg font-semibold text-blue-700 mb-2 text-center">
                      {group?.name}
                    </div>
                  )}
                  <Item key={index} item={item} />
                </>
              ))}
          </div>
          <div className="flex flex-col gap-4">
            {group?.items
              .slice(
                Math.ceil((group.items.length || 0) * 2 / 3),
                group.items.length
              )
              .map((item, index) => (
                <Item key={index} item={item} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
