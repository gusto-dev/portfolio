// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
  id: string;
  name: string;
  description: string;
  url: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json([
    {
      id: '1',
      name: 'Next.js',
      description: 'Next.js is a React framework',
      url: 'https://nextjs.org/1111',
    },
    {
      id: '2',
      name: 'React',
      description: 'React is a JavaScript library',
      url: 'https://reactjs.org/',
    },
  ]);
}
