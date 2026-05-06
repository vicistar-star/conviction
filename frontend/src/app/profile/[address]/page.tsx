'use client';
import useSWR from 'swr';
import { useParams } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProfilePage() {
  const { address } = useParams<{ address: string }>();
  const { data: rep, isLoading } = useSWR(`/api/v1/users/${address}/reputation`, fetcher);

  if (isLoading) return <p className="p-12 text-gray-400">Loading…</p>;
  if (!rep) return <p className="p-12 text-red-400">User not found.</p>;

  const accuracy = rep.totalPredictions > 0
    ? ((rep.correctPredictions / rep.totalPredictions) * 100).toFixed(1)
    : '0.0';

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 font-mono">{address}</h1>
      <span className="inline-block px-3 py-1 bg-conviction-purple/20 text-conviction-purple rounded-full text-sm font-semibold mb-8">
        {rep.reputationTier}
      </span>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Predictions', value: rep.totalPredictions },
          { label: 'Accuracy', value: `${accuracy}%` },
          { label: 'Avg Conviction', value: `${rep.totalConvictionDays > 0 ? Math.round(rep.totalConvictionDays / rep.totalPredictions) : 0}d` },
        ].map(({ label, value }) => (
          <div key={label} className="p-5 bg-gray-900 rounded-xl border border-gray-800 text-center">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
