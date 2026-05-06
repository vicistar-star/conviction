import { describe, it, expect } from '@jest/globals';
import { convictionMultiplier } from '../lib/conviction';

describe('convictionMultiplier', () => {
  it('returns 1.0 at t=0', () => {
    const m = convictionMultiplier(Date.now());
    expect(m).toBeCloseTo(1.0, 2);
  });

  it('returns ~2.0 at t=7 days', () => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const m = convictionMultiplier(sevenDaysAgo);
    expect(m).toBeCloseTo(2.0, 1);
  });
});
