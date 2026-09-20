import { connectToDatabase } from '../_db.ts';
import { extractToken } from './leads.ts';
import { verifyToken } from './login.ts';

export async function handleAdminEnquiries(req: any) {
  if (req.method !== 'GET') {
    return { status: 405, body: { success: false, message: 'Method Not Allowed' } };
  }

  const token = extractToken(req);
  if (!token || !verifyToken(token)) {
    return { status: 401, body: { success: false, message: 'Unauthorized access. Admin authentication required.' } };
  }

  try {
    const { db } = await connectToDatabase();
    if (db) {
      const enquiries = await db.collection('generalEnquiries').find({}).sort({ createdAt: -1 }).toArray();
      return { status: 200, body: { success: true, enquiries } };
    }
    return { status: 200, body: { success: true, enquiries: [] } };
  } catch (err) {
    console.error('[DB] Admin enquiries API error:', err);
    return { status: 500, body: { success: false, message: 'Internal Server Error' } };
  }
}

export default async function handler(req: any, res: any) {
  const result = await handleAdminEnquiries(req);
  return res.status(result.status).json(result.body);
}
