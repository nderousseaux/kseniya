import Background from "@/src/components/Background";
import Link from "next/link";

export default function NotFound() {
  return (
    <Background>
      <div className="flex flex-col items-center justify-center w-screen h-screen text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Board non trouvé</h1>
        <p className="text-gray-600 mb-8">Le board que vous recherchez n&apos;existe pas ou a été supprimé.</p>
        <Link 
          href="/" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </Background>   
  );
}
