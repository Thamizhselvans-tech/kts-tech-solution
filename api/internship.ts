import crypto from 'crypto';
import { connectToDatabase } from './_db';
import { sendInternshipApplicationEmails } from './_email';

const ALLOWED_TRACKS = [
  'Full-Stack Development',
  'Web Development',
  'Java Development',
  'AI Application Development',
  'Mobile App Development',
  'UI/UX Design'
];

function generateRandomSuffix(): string {
  return crypto.randomBytes(4).toString('hex').substring(0, 6).toUpperCase();
}

export async function handleInternshipApplication(reqData: any) {
  const {
    fullName,
    email,
    phone,
    college,
    degree = '',
    department = '',
    academicYear = '',
    internshipTrack,
    skills = '',
    existingSkills = '',
    github = '',
    githubUrl = '',
    portfolio = '',
    portfolioUrl = '',
    motivation = '',
    whyJoin = '',
    resumeUrl = '',
    website_hp = ''
  } = reqData || {};

  // 1. Anti-spam honeypot
  if (website_hp && typeof website_hp === 'string' && website_hp.trim() !== '') {
    return { status: 400, body: { success: false, message: 'Invalid submission detected.' } };
  }

  // 2. Server-side validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return { status: 400, body: { success: false, message: 'Please provide your valid full name (minimum 2 characters).' } };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return { status: 400, body: { success: false, message: 'Please provide a valid email address.' } };
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
    return { status: 400, body: { success: false, message: 'Please provide a valid phone/WhatsApp number.' } };
  }

  if (!college || typeof college !== 'string' || college.trim().length < 2) {
    return { status: 400, body: { success: false, message: 'Please provide your college or institution name.' } };
  }

  if (!internshipTrack || typeof internshipTrack !== 'string' || !ALLOWED_TRACKS.includes(internshipTrack.trim())) {
    return {
      status: 400,
      body: {
        success: false,
        message: `Please select a valid internship track: ${ALLOWED_TRACKS.join(', ')}`
      }
    };
  }

  const finalMotivation = (motivation || whyJoin || '').trim();
  if (!finalMotivation || finalMotivation.length < 5) {
    return { status: 400, body: { success: false, message: 'Please explain why you want to join this internship (minimum 5 characters).' } };
  }

  const finalSkills = (skills || existingSkills || '').trim();
  const finalGithub = (github || githubUrl || '').trim();
  const finalPortfolio = (portfolio || portfolioUrl || '').trim();
  const finalResume = (resumeUrl || '').trim();

  // 3. Generate Unique Application ID in format KN-INT-YYYY-XXXXXX
  const year = new Date().getFullYear();
  const applicationId = `KN-INT-${year}-${generateRandomSuffix()}`;
  const now = new Date().toISOString();

  const applicationDocument = {
    applicationId,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    college: college.trim(),
    degree: (degree || 'B.E / B.Tech').trim(),
    department: (department || 'Computer Science').trim(),
    academicYear: (academicYear || '3rd Year').trim(),
    internshipTrack: internshipTrack.trim(),
    skills: finalSkills,
    github: finalGithub,
    portfolio: finalPortfolio,
    motivation: finalMotivation,
    resumeUrl: finalResume,
    status: 'New',
    emailStatus: 'pending',
    createdAt: now,
    updatedAt: now
  };

  // 4. Save to MongoDB Atlas ("kryptonode.internshipApplications")
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      throw new Error('Database connection returned null');
    }
    await db.collection('internshipApplications').insertOne(applicationDocument);
    console.log(`[DB] Successfully stored internship application ${applicationId} in MongoDB Atlas.`);
  } catch (dbErr: any) {
    console.error('[DB] CRITICAL: Failed to save internship application to MongoDB Atlas:', dbErr);
    return {
      status: 500,
      body: {
        success: false,
        message: "We couldn't submit your application right now. Please try again."
      }
    };
  }

  // 5. Trigger Email Notification to kryptonodetechsolutions@gmail.com
  let emailDeliveryStatus: 'sent' | 'failed' = 'failed';
  let emailErrorMsg: string | undefined = undefined;
  let emailSentAt: string | undefined = undefined;

  try {
    const emailResult = await sendInternshipApplicationEmails({
      applicationId,
      fullName: applicationDocument.fullName,
      email: applicationDocument.email,
      phone: applicationDocument.phone,
      college: applicationDocument.college,
      degree: applicationDocument.degree,
      department: applicationDocument.department,
      academicYear: applicationDocument.academicYear,
      internshipTrack: applicationDocument.internshipTrack,
      skills: applicationDocument.skills,
      github: applicationDocument.github,
      portfolio: applicationDocument.portfolio,
      motivation: applicationDocument.motivation,
      resumeUrl: applicationDocument.resumeUrl,
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
    console.error('[EMAIL] Error dispatching internship application email:', emailErr);
    emailDeliveryStatus = 'failed';
    emailErrorMsg = emailErr.message || 'Email delivery exception';
  }

  // 6. Update MongoDB Document with Email Status
  try {
    const { db } = await connectToDatabase();
    if (db) {
      await db.collection('internshipApplications').updateOne(
        { applicationId },
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
    console.error('[DB] Failed updating email status for internship in MongoDB:', updateErr);
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'Thank you for applying to the Kryptonode Online Internship Program.',
      applicationId,
      referenceId: applicationId,
      data: {
        applicationId,
        fullName: applicationDocument.fullName,
        internshipTrack: applicationDocument.internshipTrack,
        status: applicationDocument.status,
        createdAt: applicationDocument.createdAt
      }
    }
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const result = await handleInternshipApplication(req.body);
  return res.status(result.status).json(result.body);
}
