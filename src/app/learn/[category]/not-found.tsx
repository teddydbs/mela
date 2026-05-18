import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16 text-center">
      <div className="text-6xl mb-4">🤔</div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Catégorie introuvable</h1>
      <p className="text-sm text-gray-500 mb-6">Cette catégorie n&apos;existe pas (encore).</p>
      <Link
        href="/"
        className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white font-bold shadow-md"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
