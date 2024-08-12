import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const devices = await prisma.device.findMany();
    res.status(200).json(devices);
  } else if (req.method === 'POST') {
    const device = await prisma.device.create({
      data: req.body,
    });
    res.status(201).json(device);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}