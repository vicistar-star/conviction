'use client';
import useSWR from 'swr';
import { useParams } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MarketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: market, isLoading } = useSWR(`/api/v1/markets/${id}`, fetcher);
  const { data: stakes } = useSWR(`/api/v1/markets/${id}/stakes`, fetcher);

  if (isLoading) return <p className="p-12 text-gray-400">Loading…</p>;
  if (!market) return <p className="p-12 text-red-400">Market not found.</p>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${market.resolved ? 'bg-green-900 text-green-300' : 'bg-purple-900 text-purple-300'}`}>
          {market.resolved ? 'Resolved' : 'Active'}
        </span>
        <span className="text-xs text-gray-500">{market.resolutionType}</span>
      </div>
      <h1 className="text-3xl font-bold mb-6">{market.title}</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Outcomes</h2>
        <div className="flex flex-col gap-2">
          {market.outcomes?.map((outcome: string, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800">
              <span>{outcome}</span>
              <button className="px-4 py-1.5 bg-conviction-purple rounded-lg text-sm font-semibold hover:opacity-90 transition">
                Stake
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Stakes ({stakes?.length ?? 0})</h2>
        <div className="flex flex-col gap-2">
          {stakes?.map((s: { id: string; stakerAddress: string; amount: string; outcomeIndex: number }) => (
            <div key={s.id} className="p-3 bg-gray-900 rounded-lg text-sm text-gray-400 flex justify-between">
              <span className="font-mono truncate max-w-xs">{s.stakerAddress}</span>
              <span>Outcome {s.outcomeIndex} · {s.amount} XLM</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
