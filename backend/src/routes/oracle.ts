import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const oracleRouter = Router();

oracleRouter.post('/report', async (req: Request, res: Response) => {
  const { marketId, source, value } = req.body;
  const report = await prisma.oracleReport.create({ data: { marketId, source, value } });
  res.status(201).json(report);
});

oracleRouter.get('/:marketId', async (req: Request, res: Response) => {
  const reports = await prisma.oracleReport.findMany({
    where: { marketId: req.params.marketId },
    orderBy: { timestamp: 'desc' },
  });
  res.json(reports);
});
