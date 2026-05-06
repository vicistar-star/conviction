import { create } from 'zustand';

interface WalletState {
  address: string | null;
  connected: boolean;
  connect: (address: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  connected: false,
  connect: (address) => set({ address, connected: true }),
  disconnect: () => set({ address: null, connected: false }),
}));
