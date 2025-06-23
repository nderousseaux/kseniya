import "@/src/app/global.css";

// Main layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html>
      <body className="antialiased bg-slate-50">
          {children}
      </body>
    </html>
  );
}