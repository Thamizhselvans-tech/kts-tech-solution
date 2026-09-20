import { connectToDatabase } from '../_db.ts';
import { verifyToken } from './login.ts';

export function extractToken(req: any): string | null {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  const customToken = req.headers?.['x-admin-token'];
  if (customToken && typeof customToken === 'string') {
    return customToken.trim();
  }

  const cookieHeader = req.headers?.cookie;
  if (cookieHeader && typeof cookieHeader === 'string') {
    const match = cookieHeader.match(/kn_admin_session=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}

export async function handleAdminLeads(req: any) {
  const method = req.method;

  // Enforce session authentication check for all admin endpoints
  const token = extractToken(req);
  const isAuthenticated = token ? verifyToken(token) : false;

  if (!isAuthenticated) {
    return {
      status: 401,
      body: { success: false, message: 'Unauthorized access. Admin authentication required.' }
    };
  }

  try {
    const { db } = await connectToDatabase();

    if (method === 'GET') {
      if (db) {
        const leads = await db.collection('projectEnquiries').find({}).sort({ createdAt: -1 }).toArray();
        const internships = await db.collection('internshipApplications').find({}).sort({ createdAt: -1 }).toArray();
        const enquiries = await db.collection('generalEnquiries').find({}).sort({ createdAt: -1 }).toArray();
        return { status: 200, body: { success: true, leads, internships, enquiries } };
      }
      return { status: 200, body: { success: true, leads: [], internships: [], enquiries: [] } };
    }

    if (method === 'PATCH' || method === 'POST') {
      const { id, leadId, applicationId, enquiryId, type, status, notes } = req.body || {};
      const targetId = id || leadId || applicationId || enquiryId;

      if (!targetId || !status) {
        return { status: 400, body: { success: false, message: 'Missing record ID or status.' } };
      }

      if (db) {
        const collectionName = type === 'internship'
          ? 'internshipApplications'
          : type === 'enquiry'
          ? 'generalEnquiries'
          : 'projectEnquiries';

        await db.collection(collectionName).updateOne(
          {
            $or: [
              { id: targetId },
              { leadId: targetId },
              { applicationId: targetId },
              { enquiryId: targetId },
              { referenceId: targetId }
            ]
          },
          {
            $set: {
              status,
              notes: notes !== undefined ? notes : '',
              updatedAt: new Date().toISOString()
            }
          }
        );
      }

      return { status: 200, body: { success: true, message: 'Status updated successfully.' } };
    }

    return { status: 405, body: { success: false, message: 'Method Not Allowed' } };
  } catch (err) {
    console.error('[DB] Admin API error:', err);
    return { status: 500, body: { success: false, message: 'Internal Server Error' } };
  }
}

export default async function handler(req: any, res: any) {
  const result = await handleAdminLeads(req);
  return res.status(result.status).json(result.body);
}
