import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'kryptonodetech@gmail.com';
const resend = resendApiKey && !resendApiKey.includes('123456789') ? new Resend(resendApiKey) : null;

export interface ProjectEnquiryEmailPayload {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  description: string;
  sourcePage?: string;
  createdAt: string;
  status?: string;
}

export async function sendProjectEnquiryEmails(payload: ProjectEnquiryEmailPayload): Promise<{
  companyEmailSent: boolean;
  clientEmailSent: boolean;
  error?: string;
}> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY is not configured or is a placeholder. Skipping live email dispatch.');
    return {
      companyEmailSent: false,
      clientEmailSent: false,
      error: 'RESEND_API_KEY is not configured or is a placeholder.'
    };
  }

  let companyEmailSent = false;
  let clientEmailSent = false;
  let lastError: string | undefined = undefined;

  const leadId = payload.leadId;
  const status = payload.status || 'New';
  const company = payload.companyName || 'N/A';
  const source = payload.sourcePage || 'Website';

  const textBody = `NEW PROJECT ENQUIRY

Lead ID:
${leadId}

Client Name:
${payload.name}

Client Email:
${payload.email}

Phone / WhatsApp:
${payload.phone}

Company:
${company}

Project Type:
${payload.projectType}

Budget:
${payload.budgetRange}

Timeline:
${payload.timeline}

Project Description:
${payload.description}

Source:
${source}

Submitted At:
${payload.createdAt}

Status:
${status}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f6f8; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #0b3c26; margin-top: 0; font-size: 22px; border-bottom: 2px solid #10b981; padding-bottom: 12px;">NEW PROJECT ENQUIRY</h2>
        
        <div style="margin: 16px 0; padding: 12px; background: #edf7f2; border-left: 4px solid #10b981; border-radius: 4px;">
          <strong style="color: #0b3c26; font-size: 15px;">Lead ID:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #0b3c26;">${leadId}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 40%;"><strong>Client Name:</strong></td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${payload.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Client Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${payload.email}" style="color: #059669; text-decoration: none;">${payload.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone / WhatsApp:</strong></td><td style="padding: 8px 0;"><a href="tel:${payload.phone}" style="color: #059669; text-decoration: none;">${payload.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Company:</strong></td><td style="padding: 8px 0; color: #0f172a;">${company}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Project Type:</strong></td><td style="padding: 8px 0; color: #0b3c26; font-weight: bold;">${payload.projectType}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Budget:</strong></td><td style="padding: 8px 0; color: #0f172a;">${payload.budgetRange}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Timeline:</strong></td><td style="padding: 8px 0; color: #0f172a;">${payload.timeline}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Source:</strong></td><td style="padding: 8px 0; color: #0f172a;">${source}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Submitted At:</strong></td><td style="padding: 8px 0; color: #0f172a;">${payload.createdAt}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Status:</strong></td><td style="padding: 8px 0; color: #059669; font-weight: bold;">${status}</td></tr>
        </table>

        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <strong style="color: #0b3c26; display: block; margin-bottom: 8px;">Project Description:</strong>
          <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${payload.description}</p>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 28px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Kryptonode Tech Solutions Pvt Ltd • Automated Client Acquisition Notification
        </p>
      </div>
    </div>
  `;

  // 1. Send Company Alert
  try {
    const { error } = await resend.emails.send({
      from: 'Kryptonode Web Portal <onboarding@resend.dev>',
      to: [COMPANY_EMAIL],
      subject: `New Project Enquiry — Kryptonode Tech Solutions — ${leadId}`,
      text: textBody,
      html: htmlBody
    });

    if (error) {
      console.error('[EMAIL] Resend returned error sending company alert:', error);
      lastError = error.message;
    } else {
      companyEmailSent = true;
      console.log(`[EMAIL] Sent project enquiry alert for ${leadId} to ${COMPANY_EMAIL}`);
    }
  } catch (err: any) {
    console.error('[EMAIL] Failed sending company alert via Resend:', err);
    lastError = err.message;
  }

  // 2. Send Client Confirmation Email
  try {
    await resend.emails.send({
      from: 'Kryptonode Tech Solutions <onboarding@resend.dev>',
      to: [payload.email],
      subject: `Your Project Enquiry — Kryptonode Tech Solutions`,
      text: `Hi ${payload.name},\n\nThanks for reaching out! We've received your project enquiry for ${payload.projectType}.\n\nLead ID: ${leadId}\n\nOur engineering team is reviewing your requirements and will get back to you shortly.\n\nKryptonode Tech Solutions Pvt Ltd`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f6f8;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0b3c26; margin-top: 0;">Thanks for reaching out. 🚀</h2>
            <p style="color: #334155; line-height: 1.6;">Hi <strong>${payload.name}</strong>,</p>
            <p style="color: #334155; line-height: 1.6;">Your project enquiry for <strong>${payload.projectType}</strong> has been received successfully. Our team is currently reviewing your project requirements.</p>
            
            <div style="margin: 20px 0; padding: 16px; background: #edf7f2; border-left: 4px solid #10b981; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #0b3c26;"><strong>Lead ID:</strong> <span style="font-family: monospace; font-weight: bold;">${leadId}</span></p>
            </div>

            <p style="color: #334155; line-height: 1.6;">We will contact you shortly via phone or email to discuss the roadmap, scope, and technical details.</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 13px; margin: 0;">Direct Contact:</p>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">
              • Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #059669;">${COMPANY_EMAIL}</a><br />
              • Phone: +91 8668109481 / +91 9361215922 / +91 9150185160
            </p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
              Kryptonode Tech Solutions Pvt Ltd • "We Build Ideas Into Real Products."
            </p>
          </div>
        </div>
      `
    });
    clientEmailSent = true;
  } catch (clientErr) {
    console.error('[EMAIL] Failed sending client confirmation email:', clientErr);
  }

  return { companyEmailSent, clientEmailSent, error: lastError };
}

export interface InternshipEmailPayload {
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  degree?: string;
  department?: string;
  academicYear?: string;
  internshipTrack: string;
  skills?: string;
  github?: string;
  portfolio?: string;
  motivation?: string;
  resumeUrl?: string;
  createdAt: string;
  status?: string;
}

export async function sendInternshipApplicationEmails(payload: InternshipEmailPayload): Promise<{
  companyEmailSent: boolean;
  clientEmailSent: boolean;
  error?: string;
}> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY is not configured or is a placeholder. Skipping live email dispatch.');
    return {
      companyEmailSent: false,
      clientEmailSent: false,
      error: 'RESEND_API_KEY is not configured or is a placeholder.'
    };
  }

  let companyEmailSent = false;
  let clientEmailSent = false;
  let lastError: string | undefined = undefined;

  const appId = payload.applicationId;
  const status = payload.status || 'New';
  const skills = payload.skills || 'N/A';
  const github = payload.github || 'N/A';
  const portfolio = payload.portfolio || 'N/A';
  const motivation = payload.motivation || 'N/A';
  const resume = payload.resumeUrl || 'N/A';

  const textBody = `INTERNSHIP APPLICATION

Application ID:
${appId}

Name:
${payload.fullName}

Email:
${payload.email}

Phone:
${payload.phone}

College:
${payload.college}

Degree:
${payload.degree || 'N/A'}

Department:
${payload.department || 'N/A'}

Academic Year:
${payload.academicYear || 'N/A'}

Internship Track:
${payload.internshipTrack}

Skills:
${skills}

GitHub:
${github}

Portfolio:
${portfolio}

Motivation:
${motivation}

Resume:
${resume}

Submitted At:
${payload.createdAt}

Status:
${status}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f6f8; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #0b3c26; margin-top: 0; font-size: 22px; border-bottom: 2px solid #10b981; padding-bottom: 12px;">INTERNSHIP APPLICATION</h2>
        
        <div style="margin: 16px 0; padding: 12px; background: #edf7f2; border-left: 4px solid #10b981; border-radius: 4px;">
          <strong style="color: #0b3c26; font-size: 15px;">Application ID:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #0b3c26;">${appId}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 40%;"><strong>Name:</strong></td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${payload.fullName}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 6px 0;"><a href="mailto:${payload.email}" style="color: #059669; text-decoration: none;">${payload.email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 6px 0;"><a href="tel:${payload.phone}" style="color: #059669; text-decoration: none;">${payload.phone}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>College:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.college}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Degree:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.degree || 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Department:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.department || 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Academic Year:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.academicYear || 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Internship Track:</strong></td><td style="padding: 6px 0; color: #0b3c26; font-weight: bold;">${payload.internshipTrack}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Skills:</strong></td><td style="padding: 6px 0; color: #0f172a;">${skills}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>GitHub:</strong></td><td style="padding: 6px 0;">${github !== 'N/A' ? `<a href="${github}" style="color: #059669;">${github}</a>` : 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Portfolio:</strong></td><td style="padding: 6px 0;">${portfolio !== 'N/A' ? `<a href="${portfolio}" style="color: #059669;">${portfolio}</a>` : 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Resume:</strong></td><td style="padding: 6px 0;">${resume !== 'N/A' ? `<a href="${resume}" style="color: #059669;">${resume}</a>` : 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Submitted At:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.createdAt}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Status:</strong></td><td style="padding: 6px 0; color: #059669; font-weight: bold;">${status}</td></tr>
        </table>

        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <strong style="color: #0b3c26; display: block; margin-bottom: 8px;">Motivation:</strong>
          <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${motivation}</p>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 28px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Kryptonode Tech Solutions Pvt Ltd • Online Internship Portal
        </p>
      </div>
    </div>
  `;

  // 1. Send Alert to Company
  try {
    const { error } = await resend.emails.send({
      from: 'Kryptonode Web Portal <onboarding@resend.dev>',
      to: [COMPANY_EMAIL],
      subject: `New Internship Application — Kryptonode Tech Solutions — ${appId}`,
      text: textBody,
      html: htmlBody
    });

    if (error) {
      console.error('[EMAIL] Resend error sending internship alert:', error);
      lastError = error.message;
    } else {
      companyEmailSent = true;
      console.log(`[EMAIL] Sent internship alert for ${appId} to ${COMPANY_EMAIL}`);
    }
  } catch (err: any) {
    console.error('[EMAIL] Failed sending internship alert via Resend:', err);
    lastError = err.message;
  }

  // 2. Send Confirmation to Student
  try {
    await resend.emails.send({
      from: 'Kryptonode Tech Solutions <onboarding@resend.dev>',
      to: [payload.email],
      subject: `Kryptonode Internship Application Received — ${appId}`,
      text: `Hi ${payload.fullName},\n\nThank you for applying to the Kryptonode Online Internship Program for the ${payload.internshipTrack} track.\n\nApplication ID: ${appId}\n\nOur team will review your profile and contact you soon.\n\nKryptonode Tech Solutions Pvt Ltd`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f6f8;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0b3c26; margin-top: 0;">Application Submitted Successfully! 🚀</h2>
            <p style="color: #334155; line-height: 1.6;">Hi <strong>${payload.fullName}</strong>,</p>
            <p style="color: #334155; line-height: 1.6;">Thank you for applying to the <strong>Kryptonode Online Internship Program</strong> for the <strong>${payload.internshipTrack}</strong> track.</p>
            
            <div style="margin: 20px 0; padding: 16px; background: #edf7f2; border-left: 4px solid #10b981; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #0b3c26;"><strong>Application ID:</strong> <span style="font-family: monospace; font-weight: bold;">${appId}</span></p>
            </div>

            <p style="color: #334155; line-height: 1.6;">Our mentor team will review your application and contact you regarding onboarding and schedule details.</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 13px; margin: 0;">Support Contacts:</p>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">
              • Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #059669;">${COMPANY_EMAIL}</a><br />
              • Founders: Thamizhprabha (8668109481) | Danish Kumar (9361215922) | Sarveshkumar (9150185160)
            </p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
              Kryptonode Tech Solutions Pvt Ltd • "Learn. Build. Experience."
            </p>
          </div>
        </div>
      `
    });
    clientEmailSent = true;
  } catch (err) {
    console.error('[EMAIL] Failed sending student confirmation email:', err);
  }

  return { companyEmailSent, clientEmailSent, error: lastError };
}

export interface GeneralEnquiryEmailPayload {
  enquiryId: string;
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  message: string;
  sourcePage?: string;
  createdAt: string;
  status?: string;
}

export async function sendGeneralEnquiryEmails(payload: GeneralEnquiryEmailPayload): Promise<{
  companyEmailSent: boolean;
  clientEmailSent: boolean;
  error?: string;
}> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY is not configured or is a placeholder. Skipping live email dispatch.');
    return {
      companyEmailSent: false,
      clientEmailSent: false,
      error: 'RESEND_API_KEY is not configured or is a placeholder.'
    };
  }

  let companyEmailSent = false;
  let clientEmailSent = false;
  let lastError: string | undefined = undefined;

  const enquiryId = payload.enquiryId;
  const status = payload.status || 'New';
  const source = payload.sourcePage || 'Website';

  const textBody = `NEW WEBSITE ENQUIRY

Enquiry ID:
${enquiryId}

Name:
${payload.name}

Email:
${payload.email}

Phone:
${payload.phone || 'N/A'}

Enquiry Type:
${payload.enquiryType}

Message:
${payload.message}

Source:
${source}

Submitted At:
${payload.createdAt}

Status:
${status}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f6f8; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #0b3c26; margin-top: 0; font-size: 22px; border-bottom: 2px solid #10b981; padding-bottom: 12px;">NEW WEBSITE ENQUIRY</h2>
        
        <div style="margin: 16px 0; padding: 12px; background: #edf7f2; border-left: 4px solid #10b981; border-radius: 4px;">
          <strong style="color: #0b3c26; font-size: 15px;">Enquiry ID:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #0b3c26;">${enquiryId}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 40%;"><strong>Name:</strong></td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${payload.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${payload.email}" style="color: #059669; text-decoration: none;">${payload.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 8px 0;"><a href="tel:${payload.phone}" style="color: #059669; text-decoration: none;">${payload.phone || 'N/A'}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Enquiry Type:</strong></td><td style="padding: 8px 0; color: #0b3c26; font-weight: bold;">${payload.enquiryType}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Source:</strong></td><td style="padding: 8px 0; color: #0f172a;">${source}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Submitted At:</strong></td><td style="padding: 8px 0; color: #0f172a;">${payload.createdAt}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;"><strong>Status:</strong></td><td style="padding: 8px 0; color: #059669; font-weight: bold;">${status}</td></tr>
        </table>

        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <strong style="color: #0b3c26; display: block; margin-bottom: 8px;">Message:</strong>
          <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${payload.message}</p>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 28px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Kryptonode Tech Solutions Pvt Ltd • Website Contact Form
        </p>
      </div>
    </div>
  `;

  // 1. Send Alert to Company
  try {
    const { error } = await resend.emails.send({
      from: 'Kryptonode Web Portal <onboarding@resend.dev>',
      to: [COMPANY_EMAIL],
      subject: `New Website Enquiry — Kryptonode Tech Solutions — ${enquiryId}`,
      text: textBody,
      html: htmlBody
    });

    if (error) {
      console.error('[EMAIL] Resend error sending general enquiry alert:', error);
      lastError = error.message;
    } else {
      companyEmailSent = true;
      console.log(`[EMAIL] Sent general enquiry alert for ${enquiryId} to ${COMPANY_EMAIL}`);
    }
  } catch (err: any) {
    console.error('[EMAIL] Failed sending general enquiry alert via Resend:', err);
    lastError = err.message;
  }

  // 2. Send Confirmation to Client
  try {
    await resend.emails.send({
      from: 'Kryptonode Tech Solutions <onboarding@resend.dev>',
      to: [payload.email],
      subject: `Your Website Enquiry Received — Kryptonode Tech Solutions`,
      text: `Hi ${payload.name},\n\nThank you for reaching out to Kryptonode Tech Solutions.\n\nEnquiry ID: ${enquiryId}\n\nWe have received your message and will get back to you shortly.\n\nKryptonode Tech Solutions Pvt Ltd`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f6f8;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0b3c26; margin-top: 0;">Thanks for contacting us! 🚀</h2>
            <p style="color: #334155; line-height: 1.6;">Hi <strong>${payload.name}</strong>,</p>
            <p style="color: #334155; line-height: 1.6;">We have received your message regarding <strong>${payload.enquiryType}</strong>.</p>
            
            <div style="margin: 20px 0; padding: 16px; background: #edf7f2; border-left: 4px solid #10b981; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #0b3c26;"><strong>Enquiry ID:</strong> <span style="font-family: monospace; font-weight: bold;">${enquiryId}</span></p>
            </div>

            <p style="color: #334155; line-height: 1.6;">Our team will review your message and get back to you shortly.</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 13px; margin: 0;">Support Contacts:</p>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">
              • Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #059669;">${COMPANY_EMAIL}</a><br />
              • Phone: +91 8668109481 / +91 9361215922 / +91 9150185160
            </p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
              Kryptonode Tech Solutions Pvt Ltd • "We Build Ideas Into Real Products."
            </p>
          </div>
        </div>
      `
    });
    clientEmailSent = true;
  } catch (err) {
    console.error('[EMAIL] Failed sending general enquiry confirmation email:', err);
  }

  return { companyEmailSent, clientEmailSent, error: lastError };
}
