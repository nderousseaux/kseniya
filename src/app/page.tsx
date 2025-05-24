// Root page
export default function Page() {
  return (
    <div className="border-solid border-2 border-blue-500 p-4 rounded-lg w-fit bg-white">
      <h1 className="text-3xl font-bold underline z-10 text-selectable w-fit" style={{ userSelect: "text" }}>
        Hello world!
      </h1>
      <p className="text-lg">Je teste présentement le zoom et le panning avec <code>next.js</code>.</p>
    </div>
  );
}