import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const circlesRouter = Router();

circlesRouter.get('/', async (_req: Request, res: Response) => {
  const circles = await prisma.circle.findMany({ include: { members: true } });
  res.json(circles);
});

circlesRouter.post('/', async (req: Request, res: Response) => {
  const { contractId, name, circleType, membershipFee, creatorAddress } = req.body;
  const circle = await prisma.circle.create({
    data: {
      contractId, name, circleType,
      membershipFee: BigInt(membershipFee ?? 0),
      creatorAddress,
      members: { create: { address: creatorAddress } },
    },
  });
  res.status(201).json(circle);
});

circlesRouter.post('/:id/join', async (req: Request, res: Response) => {
  const { address } = req.body;
  const member = await prisma.circleMember.create({
    data: { circleId: req.params.id, address },
  });
  res.status(201).json(member);
});

circlesRouter.get('/:id/members', async (req: Request, res: Response) => {
  const members = await prisma.circleMember.findMany({ where: { circleId: req.params.id } });
  res.json(members);
});
