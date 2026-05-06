import Link from 'next/link';
import { ConnectWalletButton } from './ConnectWalletButton';

export function Navbar() {
  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-conviction-purple">Conviction</Link>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/markets" className="text-gray-400 hover:text-white transition">Markets</Link>
        <Link href="/circles" className="text-gray-400 hover:text-white transition">Circles</Link>
        <Link href="/leaderboard" className="text-gray-400 hover:text-white transition">Leaderboard</Link>
        <ConnectWalletButton />
      </div>
    </nav>
  );
}
