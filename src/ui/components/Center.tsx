export default function Center({ title, desciption }: { title: string; desciption: string }) {
  return ( 
    <div className="border-solid border-2 border-blue-500 p-4 rounded-lg w-fit bg-white">
      <h1 className="text-3xl font-bold underline z-10 text-selectable w-fit" style={{ userSelect: "text" }}>
        {title}
      </h1>
      <p className="text-lg">{desciption}</p>
    </div>  
  );
}
