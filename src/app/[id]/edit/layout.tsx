// Layout for edit mode - adds striped orange and black border around the board
export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Cadre strié orange et noir */}
      <div 
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              #f97316 0px,
              #f97316 10px,
              #000000 10px,
              #000000 20px
            )
          `,
          WebkitMask: `
            linear-gradient(white, white) content-box,
            linear-gradient(white, white)
          `,
          WebkitMaskComposite: 'xor',
          mask: `
            linear-gradient(white, white) content-box,
            linear-gradient(white, white)
          `,
          maskComposite: 'exclude',
          padding: '8px'
        }}
      />
      
      {children}
    </div>
  );
}
