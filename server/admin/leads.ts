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
        const rawLeads = await db.collection('projectEnquiries').find({}).sort({ createdAt: -1 }).toArray();
        const rawInternships = await db.collection('internshipApplications').find({}).sort({ createdAt: -1 }).toArray();
        const rawEnquiries = await db.collection('generalEnquiries').find({}).sort({ createdAt: -1 }).toArray();

        const leads = rawLeads.map((l: any) => {
          const ref = l.leadId || l.referenceId || (l._id ? `KN-${new Date(l.createdAt || Date.now()).getFullYear()}-${l._id.toString().slice(-6).toUpperCase()}` : 'KN-PENDING');
          return {
            ...l,
            id: l.leadId || l.referenceId || l._id?.toString() || l.id,
            leadId: ref,
            referenceId: ref,
            budget: l.budget || l.budgetRange || 'Guidance Needed',
            date: l.date || (l.createdAt ? new Date(l.createdAt).toLocaleDateString() : new Date().toLocaleDateString())
          };
        });

        const internships = rawInternships.map((a: any) => {
          const ref = a.applicationId || a.referenceId || (a._id ? `KN-INT-${a._id.toString().slice(-6).toUpperCase()}` : 'KN-INT');
          return {
            ...a,
            id: a.applicationId || a.referenceId || a._id?.toString() || a.id,
            applicationId: ref,
            referenceId: ref,
            appliedDate: a.appliedDate || (a.createdAt ? new Date(a.createdAt).toLocaleDateString() : new Date().toLocaleDateString())
          };
        });

        const enquiries = rawEnquiries.map((e: any) => {
          const ref = e.enquiryId || e.referenceId || (e._id ? `KN-ENQ-${e._id.toString().slice(-6).toUpperCase()}` : 'KN-ENQ');
          return {
            ...e,
            id: e.enquiryId || e.referenceId || e._id?.toString() || e.id,
            enquiryId: ref,
            referenceId: ref,
            createdAt: e.createdAt || new Date().toISOString()
          };
        });

        return { status: 200, body: { success: true, leads, internships, enquiries } };
      }
      return { status: 200, body: { success: true, leads: [], internships: [], enquiries: [] } };
    }

    if (method === 'DELETE') {
      let bodyData = req.body || {};
      if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch {}
      }
      const targetId = bodyData.id || bodyData.leadId || bodyData.applicationId || bodyData.enquiryId || bodyData.targetId;
      const type = bodyData.type || 'lead';

      if (!targetId) {
        return { status: 400, body: { success: false, message: 'Missing record ID to delete.' } };
      }

      if (db) {
        const collectionName = type === 'internship'
          ? 'internshipApplications'
          : type === 'enquiry'
          ? 'generalEnquiries'
          : 'projectEnquiries';

        const deleteFilter: any = {
          $or: [
            { id: targetId },
            { leadId: targetId },
            { applicationId: targetId },
            { enquiryId: targetId },
            { referenceId: targetId }
          ]
        };

        if (typeof targetId === 'string' && targetId.length === 24 && /^[0-9a-fA-F]{24}$/.test(targetId)) {
          const { ObjectId } = await import('mongodb');
          deleteFilter.$or.push({ _id: new ObjectId(targetId) });
        }

        await db.collection(collectionName).deleteOne(deleteFilter);
      }

      return { status: 200, body: { success: true, message: 'Record deleted successfully.' } };
    }

    if (method === 'PATCH' || method === 'POST') {
      let bodyData = req.body || {};
      if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch {}
      }
      const { id, leadId, applicationId, enquiryId, type, status, notes } = bodyData;
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
