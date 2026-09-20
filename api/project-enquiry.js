// server/project-enquiry.ts
import * as crypto from "crypto";

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

// server/_email.ts
import { Resend } from "resend";
var resendApiKey = process.env.RESEND_API_KEY;
var COMPANY_EMAIL = process.env.COMPANY_EMAIL || "kryptonodetech@gmail.com";
var resend = resendApiKey && !resendApiKey.includes("123456789") ? new Resend(resendApiKey) : null;
async function sendProjectEnquiryEmails(payload) {
  if (!resend) {
    console.warn("[EMAIL] RESEND_API_KEY is not configured or is a placeholder. Skipping live email dispatch.");
    return {
      companyEmailSent: false,
      clientEmailSent: false,
      error: "RESEND_API_KEY is not configured or is a placeholder."
    };
  }
  let companyEmailSent = false;
  let clientEmailSent = false;
  let lastError = void 0;
  const leadId = payload.leadId;
  const status = payload.status || "New";
  const company = payload.companyName || "N/A";
  const source = payload.sourcePage || "Website";
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
          Kryptonode Tech Solutions Pvt Ltd \u2022 Automated Client Acquisition Notification
        </p>
      </div>
    </div>
  `;
  try {
    const { error } = await resend.emails.send({
      from: "Kryptonode Web Portal <onboarding@resend.dev>",
      to: [COMPANY_EMAIL],
      subject: `New Project Enquiry \u2014 Kryptonode Tech Solutions \u2014 ${leadId}`,
      text: textBody,
      html: htmlBody
    });
    if (error) {
      console.error("[EMAIL] Resend returned error sending company alert:", error);
      lastError = error.message;
    } else {
      companyEmailSent = true;
      console.log(`[EMAIL] Sent project enquiry alert for ${leadId} to ${COMPANY_EMAIL}`);
    }
  } catch (err) {
    console.error("[EMAIL] Failed sending company alert via Resend:", err);
    lastError = err.message;
  }
  try {
    await resend.emails.send({
      from: "Kryptonode Tech Solutions <onboarding@resend.dev>",
      to: [payload.email],
      subject: `Your Project Enquiry \u2014 Kryptonode Tech Solutions`,
      text: `Hi ${payload.name},

Thanks for reaching out! We've received your project enquiry for ${payload.projectType}.

Lead ID: ${leadId}

Our engineering team is reviewing your requirements and will get back to you shortly.

Kryptonode Tech Solutions Pvt Ltd`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f6f8;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0b3c26; margin-top: 0;">Thanks for reaching out. \u{1F680}</h2>
            <p style="color: #334155; line-height: 1.6;">Hi <strong>${payload.name}</strong>,</p>
            <p style="color: #334155; line-height: 1.6;">Your project enquiry for <strong>${payload.projectType}</strong> has been received successfully. Our team is currently reviewing your project requirements.</p>
            
            <div style="margin: 20px 0; padding: 16px; background: #edf7f2; border-left: 4px solid #10b981; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #0b3c26;"><strong>Lead ID:</strong> <span style="font-family: monospace; font-weight: bold;">${leadId}</span></p>
            </div>

            <p style="color: #334155; line-height: 1.6;">We will contact you shortly via phone or email to discuss the roadmap, scope, and technical details.</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 13px; margin: 0;">Direct Contact:</p>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">
              \u2022 Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #059669;">${COMPANY_EMAIL}</a><br />
              \u2022 Phone: +91 8668109481 / +91 9361215922 / +91 9150185160
            </p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
              Kryptonode Tech Solutions Pvt Ltd \u2022 "We Build Ideas Into Real Products."
            </p>
          </div>
        </div>
      `
    });
    clientEmailSent = true;
  } catch (clientErr) {
    console.error("[EMAIL] Failed sending client confirmation email:", clientErr);
  }
  return { companyEmailSent, clientEmailSent, error: lastError };
}

// server/project-enquiry.ts
function generateRandomSuffix() {
  return crypto.randomBytes(4).toString("hex").substring(0, 6).toUpperCase();
}
async function handleProjectEnquiry(reqData) {
  const {
    name,
    email,
    phone,
    company = "",
    companyName = "",
    projectType,
    budget = "",
    budgetRange = "",
    timeline = "",
    description,
    sourcePage = "Website",
    website_hp = ""
  } = reqData || {};
  if (website_hp && typeof website_hp === "string" && website_hp.trim() !== "") {
    console.warn("[SECURITY] Spam submission blocked via honeypot.");
    return { status: 400, body: { success: false, message: "Invalid submission detected." } };
  }
  if (!name || typeof name !== "string" || !/^[a-zA-Z\s]{2,100}$/.test(name.trim())) {
    return { status: 400, body: { success: false, message: "Please provide a valid full name containing only letters (2-100 characters)." } };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return { status: 400, body: { success: false, message: "Please provide a valid email address." } };
  }
  if (!phone || typeof phone !== "string" || !/^[0-9]{10}$/.test(phone.trim())) {
    return { status: 400, body: { success: false, message: "Please provide a valid 10-digit phone/WhatsApp number." } };
  }
  if (!projectType || typeof projectType !== "string" || projectType.trim().length === 0) {
    return { status: 400, body: { success: false, message: "Please select a valid project type." } };
  }
  if (!description || typeof description !== "string" || description.trim().length < 5) {
    return { status: 400, body: { success: false, message: "Please provide a project description (minimum 5 characters)." } };
  }
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const leadId = `KN-${year}-${generateRandomSuffix()}`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const finalCompanyName = (companyName || company || "").trim();
  const finalBudgetRange = (budgetRange || budget || "Need Guidance").trim();
  const finalTimeline = (timeline || "Flexible").trim();
  const enquiryDocument = {
    leadId,
    referenceId: leadId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    companyName: finalCompanyName,
    company: finalCompanyName,
    projectType: projectType.trim(),
    budgetRange: finalBudgetRange,
    budget: finalBudgetRange,
    timeline: finalTimeline,
    description: description.trim(),
    sourcePage: (sourcePage || "Website").trim(),
    status: "New",
    notes: `Initial project enquiry received via ${sourcePage || "Website"}.`,
    emailStatus: "pending",
    createdAt: now,
    updatedAt: now
  };
  let dbSaved = false;
  try {
    const { db } = await connectToDatabase();
    if (db) {
      await db.collection("projectEnquiries").insertOne(enquiryDocument);
      dbSaved = true;
      console.log(`[DB] Successfully stored project lead ${leadId} in MongoDB Atlas.`);
    } else {
      console.warn(`[DB] Database connection unavailable for lead ${leadId}. Check MONGODB_URI and 0.0.0.0/0 IP whitelist in MongoDB Atlas.`);
    }
  } catch (dbErr) {
    console.error("[DB] Warning: Could not write project enquiry to MongoDB Atlas (check 0.0.0.0/0 IP access in Atlas):", dbErr?.message || dbErr);
  }
  let emailDeliveryStatus = "failed";
  let emailErrorMsg = void 0;
  let emailSentAt = void 0;
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
      status: "New"
    });
    if (emailResult.companyEmailSent) {
      emailDeliveryStatus = "sent";
      emailSentAt = (/* @__PURE__ */ new Date()).toISOString();
    } else {
      emailDeliveryStatus = "failed";
      emailErrorMsg = emailResult.error || "Resend dispatch failed";
    }
  } catch (emailErr) {
    console.error("[EMAIL] Error dispatching project enquiry email:", emailErr);
    emailDeliveryStatus = "failed";
    emailErrorMsg = emailErr.message || "Email delivery exception";
  }
  try {
    const { db } = await connectToDatabase();
    if (db) {
      await db.collection("projectEnquiries").updateOne(
        { leadId },
        {
          $set: {
            emailStatus: emailDeliveryStatus,
            ...emailSentAt ? { emailSentAt } : {},
            ...emailErrorMsg ? { emailError: emailErrorMsg } : {},
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        }
      );
    }
  } catch (updateErr) {
    console.error("[DB] Failed updating email status for lead in MongoDB:", updateErr);
  }
  return {
    status: 200,
    body: {
      success: true,
      message: "Your project enquiry has been received successfully.",
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
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
  const result = await handleProjectEnquiry(req.body);
  return res.status(result.status).json(result.body);
}
export {
  handler as default,
  handleProjectEnquiry
};
