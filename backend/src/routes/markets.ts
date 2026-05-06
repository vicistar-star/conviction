import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const marketsRouter = Router();

marketsRouter.get('/', async (_req: Request, res: Response) => {
  const markets = await prisma.market.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(markets);
});

marketsRouter.get('/:id', async (req: Request, res: Response) => {
  const market = await prisma.market.findUnique({ where: { id: req.params.id } });
  if (!market) return res.status(404).json({ error: 'Market not found' });
  res.json(market);
});

marketsRouter.post('/', async (req: Request, res: Response) => {
  const { contractId, title, outcomes, resolutionType, oracleAddress, deadline, minStake, creatorAddress } = req.body;
  const market = await prisma.market.create({
    data: { contractId, title, outcomes, resolutionType, oracleAddress, deadline: new Date(deadline), minStake: BigInt(minStake), creatorAddress },
  });
  res.status(201).json(market);
});

marketsRouter.get('/:id/stakes', async (req: Request, res: Response) => {
  const stakes = await prisma.stake.findMany({ where: { marketId: req.params.id } });
  res.json(stakes);
});
