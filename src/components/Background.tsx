// Background of the app

export default function Background({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-screen h-screen overflow-hidden bg-[#fafafa] [background-image:radial-gradient(circle,#bbb_1px,transparent_1.5px),radial-gradient(circle,#eee_1px,transparent_1.5px)] [background-size:20px_20px] [background-position:0_0,10px_10px]"
    >
      {children}
    </div>

  )
}