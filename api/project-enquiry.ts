import crypto from 'crypto';
import { connectToDatabase } from './_db';
import { sendProjectEnquiryEmails } from './_email';

function generateRandomSuffix(): string {
  // Generate 6 uppercase alphanumeric characters (e.g. A8F3K2)
  return crypto.randomBytes(4).toString('hex').substring(0, 6).toUpperCase();
}

export async function handleProjectEnquiry(reqData: any) {
  const {
    name,
    email,
    phone,
    company = '',
    companyName = '',
    projectType,
    budget = '',
    budgetRange = '',
    timeline = '',
    description,
    sourcePage = 'Website',
    website_hp = ''
  } = reqData || {};

  // 1. Anti-spam honeypot verification
  if (website_hp && typeof website_hp === 'string' && website_hp.trim() !== '') {
    console.warn('[SECURITY] Spam submission blocked via honeypot.');
    return { status: 400, body: { success: false, message: 'Invalid submission detected.' } };
  }

  // 2. Strict Server-Side Input Validation & Sanitization
  if (!name || typeof name !== 'string' || !/^[a-zA-Z\s]{2,100}$/.test(name.trim())) {
    return { status: 400, body: { success: false, message: 'Please provide a valid full name containing only letters (2-100 characters).' } };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return { status: 400, body: { success: false, message: 'Please provide a valid email address.' } };
  }

  if (!phone || typeof phone !== 'string' || !/^[0-9]{10}$/.test(phone.trim())) {
    return { status: 400, body: { success: false, message: 'Please provide a valid 10-digit phone/WhatsApp number.' } };
  }

  if (!projectType || typeof projectType !== 'string' || projectType.trim().length === 0) {
    return { status: 400, body: { success: false, message: 'Please select a valid project type.' } };
  }

  if (!description || typeof description !== 'string' || description.trim().length < 5) {
    return { status: 400, body: { success: false, message: 'Please provide a project description (minimum 5 characters).' } };
  }

  // 3. Generate Unique Lead ID in format KN-YYYY-XXXXXX (e.g. KN-2026-A8F3K2)
  const year = new Date().getFullYear();
  const leadId = `KN-${year}-${generateRandomSuffix()}`;
  const now = new Date().toISOString();

  const finalCompanyName = (companyName || company || '').trim();
  const finalBudgetRange = (budgetRange || budget || 'Need Guidance').trim();
  const finalTimeline = (timeline || 'Flexible').trim();

  const enquiryDocument = {
    leadId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    companyName: finalCompanyName,
    projectType: projectType.trim(),
    budgetRange: finalBudgetRange,
    timeline: finalTimeline,
    description: description.trim(),
    sourcePage: (sourcePage || 'Website').trim(),
    status: 'New',
    notes: `Initial project enquiry received via ${sourcePage || 'Website'}.`,
    emailStatus: 'pending',
    createdAt: now,
    updatedAt: now
  };

  // 4. Save to MongoDB Atlas ("kryptonode.projectEnquiries")
  // CRITICAL: MongoDB is permanent source of truth. If DB save fails, DO NOT report false success!
  let dbSaved = false;
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      throw new Error('Database connection returned null');
    }
    await db.collection('projectEnquiries').insertOne(enquiryDocument);
    dbSaved = true;
    console.log(`[DB] Successfully stored project lead ${leadId} in MongoDB Atlas.`);
  } catch (dbErr: any) {
    console.error('[DB] CRITICAL: Failed to save project enquiry to MongoDB Atlas:', dbErr);
    return {
      status: 500,
      body: {
        success: false,
        message: "We couldn't send your enquiry right now. Please try again or contact our team."
      }
    };
  }

  // 5. Trigger Email Notification to kryptonodetech@gmail.com
  let emailDeliveryStatus: 'sent' | 'failed' = 'failed';
  let emailErrorMsg: string | undefined = undefined;
  let emailSentAt: string | undefined = undefined;

  try {
    const emailResult = await sendProjectEnquiryEmails({
      leadId,
      name: enquiryDocument.name,
      email: enquiryDocument.email,
      phone: enquiryDocument.phone,
      companyName: enquiryDocument.companyName,
      projectType: enquiryDocument.projectType,
      budgetRange: enquiryDocument.budgetRange,
      timeline: enquiryDocument.timeline,
      description: enquiryDocument.description,
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
    console.error('[EMAIL] Error dispatching project enquiry email:', emailErr);
    emailDeliveryStatus = 'failed';
    emailErrorMsg = emailErr.message || 'Email delivery exception';
  }

  // 6. Update MongoDB Document with Email Status (never loss of lead)
  try {
    const { db } = await connectToDatabase();
    if (db) {
      await db.collection('projectEnquiries').updateOne(
        { leadId },
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
    console.error('[DB] Failed updating email status for lead in MongoDB:', updateErr);
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'Your project enquiry has been received successfully.',
      leadId,
      referenceId: leadId,
      data: {
        leadId,
        name: enquiryDocument.name,
        email: enquiryDocument.email,
        projectType: enquiryDocument.projectType,
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

  const result = await handleProjectEnquiry(req.body);
  return res.status(result.status).json(result.body);
}
