import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const sims = await prisma.sim.findMany({
        where: { used: false, deleted: false },
        select: { id: true, serial: true, gsmno: true, tariff: true },
      });
      res.status(200).json(sims);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching SIMs' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/*import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const sims = await prisma.sim.findMany();
    res.status(200).json(sims);
  } else if (req.method === 'POST') {
    const sim = await prisma.sim.create({
      data: req.body,
    });
    res.status(201).json(sim);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} */