
  import { NextApiRequest, NextApiResponse } from 'next';
  import { PrismaClient } from '@prisma/client';
  
  const prisma = new PrismaClient();
  
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