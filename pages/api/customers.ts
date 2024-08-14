
  import { NextApiRequest, NextApiResponse } from 'next';
  import { PrismaClient } from '@prisma/client';
  
  const prisma = new PrismaClient();
  

/*export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const customers = await prisma.customer.findMany({
        where: { deleted: false },
        select: { id: true, name: true, serial: true, represent: true },
      });
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching customers' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
  */
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      const customers = await prisma.customer.findMany();
      res.status(200).json(customers);
    } else if (req.method === 'POST') {
      const { name, serial, represent, contact, deleted } = req.body;
      const customer = await prisma.customer.create({
        data: {
          name,
          serial,
          represent: parseInt(represent),
          contact,
          deleted: deleted === 'true',
        },
      });
      res.status(201).json(customer);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } 