// pages/api/restricted.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    res.status(200).json({
      content: "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    res.status(401).json({
      error: "You must be signed in to view the protected content on this page.",
    });
  }
}
