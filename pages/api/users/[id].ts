import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, phone, deleted } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        phone,
        deleted: deleted === 'true',
      },
    });
    res.status(200).json(user);
  } else if (req.method === 'DELETE') {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}