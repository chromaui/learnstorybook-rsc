// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { faker } from '@faker-js/faker';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  lorem: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ lorem: faker.lorem.paragraph(2) });
}
