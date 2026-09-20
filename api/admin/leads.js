// server/_db.ts
import { MongoClient } from "mongodb";
import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
}
try {
  const dotenv = await import("dotenv");
  dotenv.default?.config?.({ override: true });
} catch {
}
var cachedClient = null;
var cachedDb = null;
var FALLBACK_MONGODB_URI = "mongodb+srv://kryptonode_user:kts14092026@cluster0.fylnrnf.mongodb.net/kryptonode_db?retryWrites=true&w=majority&appName=Cluster0";
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;
  if (!uri || uri.includes("<db_username>") || uri.includes("<username>")) {
    console.warn("[DB] MONGODB_URI is missing or contains placeholder. Falling back to default cluster.");
  }
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  try {
    const client = new MongoClient(uri || FALLBACK_MONGODB_URI, {
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 6e3,
      connectTimeoutMS: 6e3
    });
    await client.connect();
    const db = client.db("kryptonode");
    Promise.resolve().then(async () => {
      try {
        await db.collection("projectEnquiries").createIndex({ leadId: 1 }, { unique: true });
        await db.collection("projectEnquiries").createIndex({ email: 1 });
        await db.collection("projectEnquiries").createIndex({ status: 1 });
        await db.collection("projectEnquiries").createIndex({ createdAt: -1 });
        await db.collection("internshipApplications").createIndex({ applicationId: 1 }, { unique: true });
        await db.collection("internshipApplications").createIndex({ email: 1 });
        await db.collection("generalEnquiries").createIndex({ enquiryId: 1 }, { unique: true });
        await db.collection("generalEnquiries").createIndex({ email: 1 });
        await db.collection("admins").createIndex({ email: 1 }, { unique: true });
      } catch (idxErr) {
        console.warn("[DB] Background index setup notice:", idxErr);
      }
    });
    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (err) {
    console.error("[DB] Error connecting to MongoDB Atlas:", err);
    return { client: null, db: null };
  }
}

// server/admin/login.ts
import * as crypto from "crypto";
import bcrypt from "bcryptjs";
var LOCKOUT_MS = 15 * 60 * 1e3;
var SESSION_SECRET = process.env.SESSION_SECRET || "kryptonode_secure_admin_session_secret_key_2026";
var ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@kryptonode.in").toLowerCase().trim();
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kts14092026";
var ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
function verifyToken(token) {
  if (!token) return false;
  try {
    const jsonStr = Buffer.from(token, "base64url").toString("utf8");
    const { email, timestamp, signature } = JSON.parse(jsonStr);
    const MAX_AGE = 24 * 60 * 60 * 1e3;
    if (Date.now() - timestamp > MAX_AGE) return false;
    const expectedRawData = `${email}:${timestamp}:${SESSION_SECRET}`;
    const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(expectedRawData).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (err) {
    return false;
  }
}

// server/admin/leads.ts
function extractToken(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  const customToken = req.headers?.["x-admin-token"];
  if (customToken && typeof customToken === "string") {
    return customToken.trim();
  }
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader && typeof cookieHeader === "string") {
    const match = cookieHeader.match(/kn_admin_session=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}
async function handleAdminLeads(req) {
  const method = req.method;
  const token = extractToken(req);
  const isAuthenticated = token ? verifyToken(token) : false;
  if (!isAuthenticated) {
    return {
      status: 401,
      body: { success: false, message: "Unauthorized access. Admin authentication required." }
    };
  }
  try {
    const { db } = await connectToDatabase();
    if (method === "GET") {
      if (db) {
        const rawLeads = await db.collection("projectEnquiries").find({}).sort({ createdAt: -1 }).toArray();
        const rawInternships = await db.collection("internshipApplications").find({}).sort({ createdAt: -1 }).toArray();
        const rawEnquiries = await db.collection("generalEnquiries").find({}).sort({ createdAt: -1 }).toArray();
        const leads = rawLeads.map((l) => {
          const ref = l.leadId || l.referenceId || (l._id ? `KN-${new Date(l.createdAt || Date.now()).getFullYear()}-${l._id.toString().slice(-6).toUpperCase()}` : "KN-PENDING");
          return {
            ...l,
            id: l.leadId || l.referenceId || l._id?.toString() || l.id,
            leadId: ref,
            referenceId: ref,
            budget: l.budget || l.budgetRange || "Guidance Needed",
            date: l.date || (l.createdAt ? new Date(l.createdAt).toLocaleDateString() : (/* @__PURE__ */ new Date()).toLocaleDateString())
          };
        });
        const internships = rawInternships.map((a) => {
          const ref = a.applicationId || a.referenceId || (a._id ? `KN-INT-${a._id.toString().slice(-6).toUpperCase()}` : "KN-INT");
          return {
            ...a,
            id: a.applicationId || a.referenceId || a._id?.toString() || a.id,
            applicationId: ref,
            referenceId: ref,
            appliedDate: a.appliedDate || (a.createdAt ? new Date(a.createdAt).toLocaleDateString() : (/* @__PURE__ */ new Date()).toLocaleDateString())
          };
        });
        const enquiries = rawEnquiries.map((e) => {
          const ref = e.enquiryId || e.referenceId || (e._id ? `KN-ENQ-${e._id.toString().slice(-6).toUpperCase()}` : "KN-ENQ");
          return {
            ...e,
            id: e.enquiryId || e.referenceId || e._id?.toString() || e.id,
            enquiryId: ref,
            referenceId: ref,
            createdAt: e.createdAt || (/* @__PURE__ */ new Date()).toISOString()
          };
        });
        return { status: 200, body: { success: true, leads, internships, enquiries } };
      }
      return { status: 200, body: { success: true, leads: [], internships: [], enquiries: [] } };
    }
    if (method === "DELETE") {
      let bodyData = req.body || {};
      if (typeof bodyData === "string") {
        try {
          bodyData = JSON.parse(bodyData);
        } catch {
        }
      }
      const targetId = bodyData.id || bodyData.leadId || bodyData.applicationId || bodyData.enquiryId || bodyData.targetId;
      const type = bodyData.type || "lead";
      if (!targetId) {
        return { status: 400, body: { success: false, message: "Missing record ID to delete." } };
      }
      if (db) {
        const collectionName = type === "internship" ? "internshipApplications" : type === "enquiry" ? "generalEnquiries" : "projectEnquiries";
        const deleteFilter = {
          $or: [
            { id: targetId },
            { leadId: targetId },
            { applicationId: targetId },
            { enquiryId: targetId },
            { referenceId: targetId }
          ]
        };
        if (typeof targetId === "string" && targetId.length === 24 && /^[0-9a-fA-F]{24}$/.test(targetId)) {
          const { ObjectId } = await import("mongodb");
          deleteFilter.$or.push({ _id: new ObjectId(targetId) });
        }
        await db.collection(collectionName).deleteOne(deleteFilter);
      }
      return { status: 200, body: { success: true, message: "Record deleted successfully." } };
    }
    if (method === "PATCH" || method === "POST") {
      let bodyData = req.body || {};
      if (typeof bodyData === "string") {
        try {
          bodyData = JSON.parse(bodyData);
        } catch {
        }
      }
      const { id, leadId, applicationId, enquiryId, type, status, notes } = bodyData;
      const targetId = id || leadId || applicationId || enquiryId;
      if (!targetId || !status) {
        return { status: 400, body: { success: false, message: "Missing record ID or status." } };
      }
      if (db) {
        const collectionName = type === "internship" ? "internshipApplications" : type === "enquiry" ? "generalEnquiries" : "projectEnquiries";
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
              notes: notes !== void 0 ? notes : "",
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }
          }
        );
      }
      return { status: 200, body: { success: true, message: "Status updated successfully." } };
    }
    return { status: 405, body: { success: false, message: "Method Not Allowed" } };
  } catch (err) {
    console.error("[DB] Admin API error:", err);
    return { status: 500, body: { success: false, message: "Internal Server Error" } };
  }
}
async function handler(req, res) {
  const result = await handleAdminLeads(req);
  return res.status(result.status).json(result.body);
}
export {
  handler as default,
  extractToken,
  handleAdminLeads
};
