


import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const personel = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const [users, total] = await Promise.all([
     prisma.user.findMany({
       skip,
      take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    

    res.status(200).json({ users, totalPages, personel });
  } else if (req.method === 'POST') {
    const { name, phone, deleted } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        deleted: deleted === 'true',
      },
    });
    res.status(201).json(user);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 
/*import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const [staff, total] = await Promise.all([
      prisma.user.findMany({
        skip,
       take: limit,
         orderBy: { created_at: 'desc' },
       }),
       prisma.user.count(),
     ]);
 
     const totalPages = Math.ceil(total / limit);
     res.status(200).json({ users, totalPages, staff });
  } else if (req.method === 'POST') {
    const { name, phone, deleted } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        deleted: deleted === 'true',
      },
    });
    res.status(201).json(user);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

*/