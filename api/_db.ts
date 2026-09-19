import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ override: true });

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const FALLBACK_MONGODB_URI = 'mongodb+srv://kryptonode_user:kts14092026@cluster0.fylnrnf.mongodb.net/kryptonode_db?retryWrites=true&w=majority&appName=Cluster0';

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  const uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;

  if (!uri || uri.includes('<db_username>') || uri.includes('<username>')) {
    console.warn('[DB] MONGODB_URI is missing or contains placeholder. Falling back to default cluster.');
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(uri || FALLBACK_MONGODB_URI, {
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000
    });
    await client.connect();
    
    // Explicitly select dedicated "kryptonode" database
    const db = client.db('kryptonode');
    
    // Set up collection indexes non-blockingly
    Promise.resolve().then(async () => {
      try {
        await db.collection('projectEnquiries').createIndex({ leadId: 1 }, { unique: true });
        await db.collection('projectEnquiries').createIndex({ email: 1 });
        await db.collection('projectEnquiries').createIndex({ status: 1 });
        await db.collection('projectEnquiries').createIndex({ createdAt: -1 });

        await db.collection('internshipApplications').createIndex({ applicationId: 1 }, { unique: true });
        await db.collection('internshipApplications').createIndex({ email: 1 });

        await db.collection('generalEnquiries').createIndex({ enquiryId: 1 }, { unique: true });
        await db.collection('generalEnquiries').createIndex({ email: 1 });

        await db.collection('admins').createIndex({ email: 1 }, { unique: true });
      } catch (idxErr) {
        // Non-fatal warning
        console.warn('[DB] Background index setup notice:', idxErr);
      }
    });

    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (err) {
    console.error('[DB] Error connecting to MongoDB Atlas:', err);
    return { client: null, db: null };
  }
}
