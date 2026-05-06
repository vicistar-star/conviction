import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const reputationRouter = Router();

reputationRouter.get('/:address/reputation', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { stellarAddress: req.params.address } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

reputationRouter.get('/leaderboard', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: [{ correctPredictions: 'desc' }, { totalConvictionDays: 'desc' }],
    take: 50,
  });
  res.json(users);
});
