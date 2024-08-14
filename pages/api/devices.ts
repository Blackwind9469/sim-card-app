import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const devices = await prisma.device.findMany({
        where: { used: false, deleted: false },
        select: { id: true, serial: true, type: true },
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching devices' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}