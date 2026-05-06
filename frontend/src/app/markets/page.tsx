'use client';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Market {
  id: string;
  title: string;
  resolutionType: string;
  deadline: string;
  resolved: boolean;
}

export default function MarketsPage() {
  const { data: markets, isLoading } = useSWR<Market[]>('/api/v1/markets', fetcher);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Markets</h1>
        <Link href="/markets/new" className="px-4 py-2 bg-conviction-purple rounded-lg text-sm font-semibold hover:opacity-90 transition">
          + Create Market
        </Link>
      </div>

      {isLoading && <p className="text-gray-400">Loading markets…</p>}

      <div className="flex flex-col gap-4">
        {markets?.map((m) => (
          <Link key={m.id} href={`/markets/${m.id}`} className="block p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-conviction-purple transition">
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-lg">{m.title}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${m.resolved ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
                {m.resolved ? 'Resolved' : 'Active'}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {m.resolutionType} · Deadline {new Date(m.deadline).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
