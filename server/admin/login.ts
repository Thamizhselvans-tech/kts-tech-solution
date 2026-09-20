import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../_db.ts';

// In-memory rate limiting map for login attempts
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

const SESSION_SECRET = process.env.SESSION_SECRET || 'kryptonode_secure_admin_session_secret_key_2026';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@kryptonode.in').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kts14092026';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

export function generateToken(email: string): string {
  const timestamp = Date.now();
  const rawData = `${email}:${timestamp}:${SESSION_SECRET}`;
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(rawData).digest('hex');
  return Buffer.from(JSON.stringify({ email, timestamp, signature })).toString('base64url');
}

export function verifyToken(token: string): boolean {
  if (!token) return false;
  try {
    const jsonStr = Buffer.from(token, 'base64url').toString('utf8');
    const { email, timestamp, signature } = JSON.parse(jsonStr);

    const MAX_AGE = 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > MAX_AGE) return false;

    const expectedRawData = `${email}:${timestamp}:${SESSION_SECRET}`;
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(expectedRawData).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (err) {
    return false;
  }
}

async function verifyAdminCredentials(email: string, pass: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();

  // 1. Check MongoDB Atlas "admins" collection first
  try {
    const { db } = await connectToDatabase();
    if (db) {
      const dbAdmin = await db.collection('admins').findOne({ email: normalized });
      if (dbAdmin && dbAdmin.passwordHash) {
        const isBcryptMatch = await bcrypt.compare(pass, dbAdmin.passwordHash).catch(() => false);
        if (isBcryptMatch) return true;

        // Fallback for sha256 or exact match if stored
        const sha256Hash = crypto.createHash('sha256').update(pass).digest('hex');
        if (dbAdmin.passwordHash === sha256Hash || dbAdmin.passwordHash === pass) {
          return true;
        }
      }
    }
  } catch (err) {
    console.error('[DB] Admin search error:', err);
  }

  // 2. Check Environment Variables
  const isEmailMatch = (
    normalized === ADMIN_EMAIL ||
    normalized === 'kryptonodetech@gmail.com' ||
    normalized === 'kryptonodetechsolutions@gmail.com'
  );

  if (!isEmailMatch) return false;

  if (ADMIN_PASSWORD_HASH) {
    const hash = crypto.createHash('sha256').update(pass).digest('hex');
    if (hash === ADMIN_PASSWORD_HASH) return true;
  }

  try {
    const inputBuf = Buffer.from(pass);
    const expectedBuf = Buffer.from(ADMIN_PASSWORD);
    if (inputBuf.length === expectedBuf.length && crypto.timingSafeEqual(inputBuf, expectedBuf)) {
      // Seed default admin in MongoDBAtlas "admins" collection asynchronously
      connectToDatabase().then(async ({ db }) => {
        if (db) {
          const hashedPassword = await bcrypt.hash(pass, 10);
          await db.collection('admins').updateOne(
            { email: normalized },
            {
              $setOnInsert: {
                email: normalized,
                passwordHash: hashedPassword,
                role: 'admin',
                createdAt: new Date().toISOString()
              },
              $set: { updatedAt: new Date().toISOString() }
            },
            { upsert: true }
          );
        }
      }).catch(() => {});
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function handleAdminLogin(req: any) {
  if (req.method !== 'POST') {
    return { status: 405, body: { success: false, message: 'Method Not Allowed' } };
  }

  const ip = req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress || 'client';
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
          message: 'Too many failed login attempts. Please try again later.'
        }
      };
    }
  }

  const { email, password } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return { status: 400, body: { success: false, message: 'Invalid admin credentials.' } };
  }

  const isValid = await verifyAdminCredentials(email, password);

  if (!isValid) {
    const current = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
    loginAttempts.set(ip, { count: current.count + 1, firstAttempt: current.firstAttempt });
    return { status: 401, body: { success: false, message: 'Invalid admin credentials.' } };
  }

  loginAttempts.delete(ip);

  const token = generateToken(email.trim().toLowerCase());

  return {
    status: 200,
    body: {
      success: true,
      role: 'admin',
      token,
      message: 'Authentication successful.'
    },
    headers: {
      'Set-Cookie': `kn_admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    }
  };
}

export default async function handler(req: any, res: any) {
  const result = await handleAdminLogin(req);
  if (result.headers) {
    Object.entries(result.headers).forEach(([key, val]) => {
      res.setHeader(key, val as string);
    });
  }
  return res.status(result.status).json(result.body);
}
