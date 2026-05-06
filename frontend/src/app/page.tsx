import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-conviction-purple mb-4">Conviction</h1>
        <p className="text-xl text-gray-400 max-w-xl">
          Conviction-weighted social prediction markets on Stellar. The longer you hold, the more you earn.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/markets" className="px-6 py-3 bg-conviction-purple rounded-lg font-semibold hover:opacity-90 transition">
          Browse Markets
        </Link>
        <Link href="/profile" className="px-6 py-3 border border-conviction-purple rounded-lg font-semibold hover:bg-conviction-purple/10 transition">
          My Profile
        </Link>
      </div>
    </main>
  );
}
