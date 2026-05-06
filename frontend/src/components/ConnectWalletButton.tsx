'use client';
import { useWalletStore } from '@/store/wallet';

export function ConnectWalletButton() {
  const { address, connected, connect, disconnect } = useWalletStore();

  async function handleConnect() {
    try {
      // @ts-expect-error freighter injected global
      const { publicKey } = await window.freighter?.getPublicKey();
      if (publicKey) connect(publicKey);
    } catch {
      alert('Freighter wallet not found. Please install it.');
    }
  }

  if (connected && address) {
    return (
      <button
        onClick={disconnect}
        className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-mono hover:border-red-500 transition"
      >
        {address.slice(0, 6)}…{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 bg-conviction-purple rounded-lg text-sm font-semibold hover:opacity-90 transition"
    >
      Connect Wallet
    </button>
  );
}
