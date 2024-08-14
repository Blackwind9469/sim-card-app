import { NextApiRequest, NextApiResponse } from 'next';
//import {PrismaClient} from '@prisma/client';
//import { number } from 'yup';
import prisma from '../../lib/prisma';
//const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { simId, customerId, deviceId, type, licensePlate, start, finish } = req.body;

      const newContract = await prisma.$transaction(async (prisma) => {
        // Create new contract
        const contract = await prisma.contract.create({
          data: {
            sim_id: parseInt(simId),
            customer_id: parseInt(customerId),
            device_id: parseInt(deviceId),
            type,
            deleted: false,
            license_plate: licensePlate,
            start: new Date(start),
            finish: new Date(finish),
          },
        });

        // Update SIM and Device to used
        await prisma.sim.update({
          where: { id: simId },
          data: { used: true },
        });

        await prisma.device.update({
          where: { id: deviceId },
          data: { used: true },
        });

        return contract;
      });

      res.status(201).json(newContract);
    } catch (error) {
      res.status(500).json({ error: 'Error creating contract' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}