import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const stakesRouter = Router();

// Conviction multiplier: C(t) = 1 + log2(1 + t/7d)
function convictionMultiplier(stakedAt: Date): number {
  const sevenDays = 7 * 24 * 3600 * 1000;
  const elapsed = Date.now() - stakedAt.getTime();
  return 1 + Math.log2(1 + elapsed / sevenDays);
}

stakesRouter.post('/', async (req: Request, res: Response) => {
  const { contractId, stakerAddress, marketId, outcomeIndex, amount } = req.body;
  const stake = await prisma.stake.create({
    data: { contractId, stakerAddress, marketId, outcomeIndex, amount: BigInt(amount) },
  });
  res.status(201).json(stake);
});

stakesRouter.get('/:id/conviction', async (req: Request, res: Response) => {
  const stake = await prisma.stake.findUnique({ where: { id: req.params.id } });
  if (!stake) return res.status(404).json({ error: 'Stake not found' });
  res.json({ multiplier: convictionMultiplier(stake.stakedAt) });
});

stakesRouter.delete('/:id', async (req: Request, res: Response) => {
  await prisma.stake.update({ where: { id: req.params.id }, data: { unstaked: true } });
  res.json({ message: 'Unstaked — conviction forfeited' });
});

stakesRouter.post('/:id/claim', async (req: Request, res: Response) => {
  const stake = await prisma.stake.findUnique({ where: { id: req.params.id } });
  if (!stake) return res.status(404).json({ error: 'Stake not found' });
  if (stake.rewardClaimed) return res.status(400).json({ error: 'Already claimed' });
  await prisma.stake.update({ where: { id: req.params.id }, data: { rewardClaimed: true } });
  res.json({ message: 'Reward claimed' });
});
