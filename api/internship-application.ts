import { handleInternshipApplication } from './internship.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const result = await handleInternshipApplication(req.body);
  return res.status(result.status).json(result.body);
}
