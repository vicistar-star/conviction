/** Conviction multiplier: C(t) = 1 + log2(1 + t/7d) */
export function convictionMultiplier(stakedAtMs: number): number {
  const sevenDays = 7 * 24 * 3600 * 1000;
  const elapsed = Date.now() - stakedAtMs;
  return 1 + Math.log2(1 + elapsed / sevenDays);
}

export function formatMultiplier(m: number): string {
  return `${m.toFixed(2)}x`;
}
