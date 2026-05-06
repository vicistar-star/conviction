import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Conviction — Prediction Markets on Stellar',
  description: 'Conviction-weighted social prediction markets. Earn reputation for being early and right.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
