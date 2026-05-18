import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB800] flex items-center justify-center mb-4 shadow-xl shadow-[#FF6B35]/40">
        <Compass size={32} className="text-white" strokeWidth={2.5} />
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Catégorie introuvable</h1>
      <p className="text-sm text-gray-500 mb-6">Cette catégorie n&apos;existe pas (encore).</p>
      <Link
        href="/"
        className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white font-extrabold shadow-md"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
