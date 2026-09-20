// server/admin/login.ts
import * as crypto from "crypto";
import bcrypt from "bcryptjs";

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
var loginAttempts = /* @__PURE__ */ new Map();
var MAX_ATTEMPTS = 5;
var LOCKOUT_MS = 15 * 60 * 1e3;
var SESSION_SECRET = process.env.SESSION_SECRET || "kryptonode_secure_admin_session_secret_key_2026";
var ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@kryptonode.in").toLowerCase().trim();
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kts14092026";
var ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
function generateToken(email) {
  const timestamp = Date.now();
  const rawData = `${email}:${timestamp}:${SESSION_SECRET}`;
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(rawData).digest("hex");
  return Buffer.from(JSON.stringify({ email, timestamp, signature })).toString("base64url");
}
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
async function verifyAdminCredentials(email, pass) {
  const normalized = email.toLowerCase().trim();
  try {
    const { db } = await connectToDatabase();
    if (db) {
      const dbAdmin = await db.collection("admins").findOne({ email: normalized });
      if (dbAdmin && dbAdmin.passwordHash) {
        const isBcryptMatch = await bcrypt.compare(pass, dbAdmin.passwordHash).catch(() => false);
        if (isBcryptMatch) return true;
        const sha256Hash = crypto.createHash("sha256").update(pass).digest("hex");
        if (dbAdmin.passwordHash === sha256Hash || dbAdmin.passwordHash === pass) {
          return true;
        }
      }
    }
  } catch (err) {
    console.error("[DB] Admin search error:", err);
  }
  const isEmailMatch = normalized === ADMIN_EMAIL || normalized === "kryptonodetech@gmail.com" || normalized === "kryptonodetechsolutions@gmail.com";
  if (!isEmailMatch) return false;
  if (ADMIN_PASSWORD_HASH) {
    const hash = crypto.createHash("sha256").update(pass).digest("hex");
    if (hash === ADMIN_PASSWORD_HASH) return true;
  }
  try {
    const inputBuf = Buffer.from(pass);
    const expectedBuf = Buffer.from(ADMIN_PASSWORD);
    if (inputBuf.length === expectedBuf.length && crypto.timingSafeEqual(inputBuf, expectedBuf)) {
      connectToDatabase().then(async ({ db }) => {
        if (db) {
          const hashedPassword = await bcrypt.hash(pass, 10);
          await db.collection("admins").updateOne(
            { email: normalized },
            {
              $setOnInsert: {
                email: normalized,
                passwordHash: hashedPassword,
                role: "admin",
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              },
              $set: { updatedAt: (/* @__PURE__ */ new Date()).toISOString() }
            },
            { upsert: true }
          );
        }
      }).catch(() => {
      });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
async function handleAdminLogin(req) {
  if (req.method !== "POST") {
    return { status: 405, body: { success: false, message: "Method Not Allowed" } };
  }
  const ip = req.headers?.["x-forwarded-for"] || req.connection?.remoteAddress || "client";
  const now = Date.now();
  const attemptsInfo = loginAttempts.get(ip);
  if (attemptsInfo) {
    if (now - attemptsInfo.firstAttempt > LOCKOUT_MS) {
      loginAttempts.delete(ip);
    } else if (attemptsInfo.count >= MAX_ATTEMPTS) {
      return {
        status: 429,
        body: {
          success: false,
          message: "Too many failed login attempts. Please try again later."
        }
      };
    }
  }
  const { email, password } = req.body || {};
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return { status: 400, body: { success: false, message: "Invalid admin credentials." } };
  }
  const isValid = await verifyAdminCredentials(email, password);
  if (!isValid) {
    const current = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
    loginAttempts.set(ip, { count: current.count + 1, firstAttempt: current.firstAttempt });
    return { status: 401, body: { success: false, message: "Invalid admin credentials." } };
  }
  loginAttempts.delete(ip);
  const token = generateToken(email.trim().toLowerCase());
  return {
    status: 200,
    body: {
      success: true,
      role: "admin",
      token,
      message: "Authentication successful."
    },
    headers: {
      "Set-Cookie": `kn_admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    }
  };
}
async function handler(req, res) {
  const result = await handleAdminLogin(req);
  if (result.headers) {
    Object.entries(result.headers).forEach(([key, val]) => {
      res.setHeader(key, val);
    });
  }
  return res.status(result.status).json(result.body);
}
export {
  handler as default,
  generateToken,
  handleAdminLogin,
  verifyToken
};
