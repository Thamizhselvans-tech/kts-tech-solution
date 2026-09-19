import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ override: true });

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<db_username>')) {
    console.warn('[DB] MONGODB_URI is missing or contains placeholder <db_username>. Please update your database username in .env file.');
    return { client: null, db: null };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(uri, {
      tlsAllowInvalidCertificates: true
    });
    await client.connect();
    
    // Explicitly select dedicated "kryptonode" database
    const db = client.db('kryptonode');
    
    // Set up collection indexes
    await db.collection('projectEnquiries').createIndex({ leadId: 1 }, { unique: true });
    await db.collection('projectEnquiries').createIndex({ email: 1 });
    await db.collection('projectEnquiries').createIndex({ status: 1 });
    await db.collection('projectEnquiries').createIndex({ createdAt: -1 });

    await db.collection('internshipApplications').createIndex({ applicationId: 1 }, { unique: true });
    await db.collection('internshipApplications').createIndex({ email: 1 });
    await db.collection('internshipApplications').createIndex({ status: 1 });
    await db.collection('internshipApplications').createIndex({ internshipTrack: 1 });
    await db.collection('internshipApplications').createIndex({ createdAt: -1 });

    await db.collection('generalEnquiries').createIndex({ enquiryId: 1 }, { unique: true });
    await db.collection('generalEnquiries').createIndex({ email: 1 });
    await db.collection('generalEnquiries').createIndex({ status: 1 });
    await db.collection('generalEnquiries').createIndex({ createdAt: -1 });

    await db.collection('admins').createIndex({ email: 1 }, { unique: true });

    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (err) {
    console.error('[DB] Error connecting to MongoDB Atlas:', err);
    return { client: null, db: null };
  }
}
