import "@/src/ui/global.css";
// import InfiniteCanvas from '@/src/ui/components/InfiniteCanvas';

// filepath: /Users/nderousseaux/dev/kseniya/src/app/edit/layout.tsx

export default function EditLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body className="antialiased">
                {/* <InfiniteCanvas> */}
                {children}
                {/* </InfiniteCanvas> */}
            </body>
        </html>
    );
}