import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const simCount = await prisma.sim.count();
    const deviceCount = await prisma.device.count();
    const customerCount = await prisma.customer.count();
    const userCount = await prisma.user.count();
    const contractCount = await prisma.contract.count();
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const nearDueContracts = await prisma.contract.count({
      where: {
        finish: {
          lte: thirtyDaysFromNow,
        },
      },
    });

    res.status(200).json({
      simCount,
      deviceCount,
      customerCount,
      userCount,
      contractCount,
      nearDueContracts,
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}