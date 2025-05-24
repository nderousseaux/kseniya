import "@/src/ui/global.css";
import InfiniteCanvas from '@/src/ui/components/InfiniteCanvas';

// Main layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="antialiased">
        <InfiniteCanvas>
          {children}
        </InfiniteCanvas>
      </body>
    </html>
  );
}