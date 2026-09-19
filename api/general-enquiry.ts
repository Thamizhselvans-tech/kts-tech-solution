import crypto from 'crypto';
import { connectToDatabase } from './_db';
import { sendGeneralEnquiryEmails } from './_email';

function generateRandomSuffix(): string {
  return crypto.randomBytes(4).toString('hex').substring(0, 6).toUpperCase();
}

export async function handleGeneralEnquiry(reqData: any) {
  const {
    name,
    email,
    phone = '',
    enquiryType = 'General',
    message,
    sourcePage = 'Website Contact Form',
    website_hp = ''
  } = reqData || {};

  // 1. Anti-spam honeypot
  if (website_hp && typeof website_hp === 'string' && website_hp.trim() !== '') {
    return { status: 400, body: { success: false, message: 'Invalid submission detected.' } };
  }

  // 2. Server-side validation
  if (!name || typeof name !== 'string' || !/^[a-zA-Z\s]{2,100}$/.test(name.trim())) {
    return { status: 400, body: { success: false, message: 'Please provide a valid name containing only letters (2-100 characters).' } };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return { status: 400, body: { success: false, message: 'Please provide a valid email address.' } };
  }

  if (!phone || typeof phone !== 'string' || !/^[0-9]{10}$/.test(phone.trim())) {
    return { status: 400, body: { success: false, message: 'Please provide a valid 10-digit phone number.' } };
  }

  if (!enquiryType || typeof enquiryType !== 'string' || enquiryType.trim().length === 0) {
    return { status: 400, body: { success: false, message: 'Please select an enquiry type.' } };
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return { status: 400, body: { success: false, message: 'Please provide your enquiry message (minimum 5 characters).' } };
  }

  // 3. Generate Unique Enquiry ID in format KN-GEN-YYYY-XXXXXX
  const year = new Date().getFullYear();
  const enquiryId = `KN-GEN-${year}-${generateRandomSuffix()}`;
  const now = new Date().toISOString();

  const enquiryDocument = {
    enquiryId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: (phone || '').trim(),
    enquiryType: (enquiryType || 'General').trim(),
    message: message.trim(),
    sourcePage: (sourcePage || 'Website Contact Form').trim(),
    status: 'New',
    emailStatus: 'pending',
    createdAt: now,
    updatedAt: now
  };

  // 4. Save to MongoDB Atlas in "kryptonode.generalEnquiries"
  try {
    const { db } = await connectToDatabase();
    if (db) {
      await db.collection('generalEnquiries').insertOne(enquiryDocument);
      console.log(`[DB] Successfully stored general enquiry ${enquiryId} in MongoDB Atlas.`);
    } else {
      console.warn(`[DB] Database connection unavailable for general enquiry ${enquiryId}.`);
    }
  } catch (dbErr: any) {
    console.error('[DB] Warning: Could not write general enquiry to MongoDB Atlas (check 0.0.0.0/0 IP access in Atlas):', dbErr?.message || dbErr);
  }

  // 5. Trigger Email Notification to kryptonodetech@gmail.com
  let emailDeliveryStatus: 'sent' | 'failed' = 'failed';
  let emailErrorMsg: string | undefined = undefined;
  let emailSentAt: string | undefined = undefined;

  try {
    const emailResult = await sendGeneralEnquiryEmails({
      enquiryId,
      name: enquiryDocument.name,
      email: enquiryDocument.email,
      phone: enquiryDocument.phone,
      enquiryType: enquiryDocument.enquiryType,
      message: enquiryDocument.message,
      sourcePage: enquiryDocument.sourcePage,
      createdAt: now,
      status: 'New'
    });

    if (emailResult.companyEmailSent) {
      emailDeliveryStatus = 'sent';
      emailSentAt = new Date().toISOString();
    } else {
      emailDeliveryStatus = 'failed';
      emailErrorMsg = emailResult.error || 'Resend dispatch failed';
    }
  } catch (emailErr: any) {
    console.error('[EMAIL] Error dispatching general enquiry email:', emailErr);
    emailDeliveryStatus = 'failed';
    emailErrorMsg = emailErr.message || 'Email delivery exception';
  }

  // 6. Update MongoDB Document with Email Status
  try {
    const { db } = await connectToDatabase();
    if (db) {
      await db.collection('generalEnquiries').updateOne(
        { enquiryId },
        {
          $set: {
            emailStatus: emailDeliveryStatus,
            ...(emailSentAt ? { emailSentAt } : {}),
            ...(emailErrorMsg ? { emailError: emailErrorMsg } : {}),
            updatedAt: new Date().toISOString()
          }
        }
      );
    }
  } catch (updateErr) {
    console.error('[DB] Failed updating email status for general enquiry in MongoDB:', updateErr);
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'Your enquiry message has been received successfully.',
      enquiryId,
      referenceId: enquiryId,
      data: {
        enquiryId,
        name: enquiryDocument.name,
        email: enquiryDocument.email,
        enquiryType: enquiryDocument.enquiryType,
        status: enquiryDocument.status,
        createdAt: enquiryDocument.createdAt
      }
    }
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const result = await handleGeneralEnquiry(req.body);
  return res.status(result.status).json(result.body);
}
