// server/internship.ts
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
async function sendInternshipApplicationEmails(payload) {
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
  const appId = payload.applicationId;
  const status = payload.status || "New";
  const skills = payload.skills || "N/A";
  const github = payload.github || "N/A";
  const portfolio = payload.portfolio || "N/A";
  const motivation = payload.motivation || "N/A";
  const resume = payload.resumeUrl || "N/A";
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
${payload.degree || "N/A"}

Department:
${payload.department || "N/A"}

Academic Year:
${payload.academicYear || "N/A"}

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
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Degree:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.degree || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Department:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.department || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Academic Year:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.academicYear || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Internship Track:</strong></td><td style="padding: 6px 0; color: #0b3c26; font-weight: bold;">${payload.internshipTrack}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Skills:</strong></td><td style="padding: 6px 0; color: #0f172a;">${skills}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>GitHub:</strong></td><td style="padding: 6px 0;">${github !== "N/A" ? `<a href="${github}" style="color: #059669;">${github}</a>` : "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Portfolio:</strong></td><td style="padding: 6px 0;">${portfolio !== "N/A" ? `<a href="${portfolio}" style="color: #059669;">${portfolio}</a>` : "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Resume:</strong></td><td style="padding: 6px 0;">${resume !== "N/A" ? `<a href="${resume}" style="color: #059669;">${resume}</a>` : "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Submitted At:</strong></td><td style="padding: 6px 0; color: #0f172a;">${payload.createdAt}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Status:</strong></td><td style="padding: 6px 0; color: #059669; font-weight: bold;">${status}</td></tr>
        </table>

        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <strong style="color: #0b3c26; display: block; margin-bottom: 8px;">Motivation:</strong>
          <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${motivation}</p>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 28px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Kryptonode Tech Solutions Pvt Ltd \u2022 Online Internship Portal
        </p>
      </div>
    </div>
  `;
  try {
    const { error } = await resend.emails.send({
      from: "Kryptonode Web Portal <onboarding@resend.dev>",
      to: [COMPANY_EMAIL],
      subject: `New Internship Application \u2014 Kryptonode Tech Solutions \u2014 ${appId}`,
      text: textBody,
      html: htmlBody
    });
    if (error) {
      console.error("[EMAIL] Resend error sending internship alert:", error);
      lastError = error.message;
    } else {
      companyEmailSent = true;
      console.log(`[EMAIL] Sent internship alert for ${appId} to ${COMPANY_EMAIL}`);
    }
  } catch (err) {
    console.error("[EMAIL] Failed sending internship alert via Resend:", err);
    lastError = err.message;
  }
  try {
    await resend.emails.send({
      from: "Kryptonode Tech Solutions <onboarding@resend.dev>",
      to: [payload.email],
      subject: `Kryptonode Internship Application Received \u2014 ${appId}`,
      text: `Hi ${payload.fullName},

Thank you for applying to the Kryptonode Online Internship Program for the ${payload.internshipTrack} track.

Application ID: ${appId}

Our team will review your profile and contact you soon.

Kryptonode Tech Solutions Pvt Ltd`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f6f8;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0b3c26; margin-top: 0;">Application Submitted Successfully! \u{1F680}</h2>
            <p style="color: #334155; line-height: 1.6;">Hi <strong>${payload.fullName}</strong>,</p>
            <p style="color: #334155; line-height: 1.6;">Thank you for applying to the <strong>Kryptonode Online Internship Program</strong> for the <strong>${payload.internshipTrack}</strong> track.</p>
            
            <div style="margin: 20px 0; padding: 16px; background: #edf7f2; border-left: 4px solid #10b981; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #0b3c26;"><strong>Application ID:</strong> <span style="font-family: monospace; font-weight: bold;">${appId}</span></p>
            </div>

            <p style="color: #334155; line-height: 1.6;">Our mentor team will review your application and contact you regarding onboarding and schedule details.</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 13px; margin: 0;">Support Contacts:</p>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">
              \u2022 Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #059669;">${COMPANY_EMAIL}</a><br />
              \u2022 Founders: Thamizhprabha (8668109481) | Danish Kumar (9361215922) | Sarveshkumar (9150185160)
            </p>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">
              Kryptonode Tech Solutions Pvt Ltd \u2022 "Learn. Build. Experience."
            </p>
          </div>
        </div>
      `
    });
    clientEmailSent = true;
  } catch (err) {
    console.error("[EMAIL] Failed sending student confirmation email:", err);
  }
  return { companyEmailSent, clientEmailSent, error: lastError };
}

// server/internship.ts
var ALLOWED_TRACKS = [
  "Full-Stack Development",
  "Web Development",
  "Java Development",
  "AI Application Development",
  "Mobile App Development",
  "UI/UX Design"
];
function generateRandomSuffix() {
  return crypto.randomBytes(4).toString("hex").substring(0, 6).toUpperCase();
}
async function handleInternshipApplication(reqData) {
  const {
    fullName,
    email,
    phone,
    college,
    degree = "",
    department = "",
    academicYear = "",
    internshipTrack,
    skills = "",
    existingSkills = "",
    github = "",
    githubUrl = "",
    portfolio = "",
    portfolioUrl = "",
    motivation = "",
    whyJoin = "",
    resumeUrl = "",
    website_hp = ""
  } = reqData || {};
  if (website_hp && typeof website_hp === "string" && website_hp.trim() !== "") {
    return { status: 400, body: { success: false, message: "Invalid submission detected." } };
  }
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return { status: 400, body: { success: false, message: "Please provide your valid full name (minimum 2 characters)." } };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return { status: 400, body: { success: false, message: "Please provide a valid email address." } };
  }
  if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
    return { status: 400, body: { success: false, message: "Please provide a valid phone/WhatsApp number." } };
  }
  if (!college || typeof college !== "string" || college.trim().length < 2) {
    return { status: 400, body: { success: false, message: "Please provide your college or institution name." } };
  }
  if (!internshipTrack || typeof internshipTrack !== "string" || !ALLOWED_TRACKS.includes(internshipTrack.trim())) {
    return {
      status: 400,
      body: {
        success: false,
        message: `Please select a valid internship track: ${ALLOWED_TRACKS.join(", ")}`
      }
    };
  }
  const finalMotivation = (motivation || whyJoin || "").trim();
  if (!finalMotivation || finalMotivation.length < 5) {
    return { status: 400, body: { success: false, message: "Please explain why you want to join this internship (minimum 5 characters)." } };
  }
  const finalSkills = (skills || existingSkills || "").trim();
  const finalGithub = (github || githubUrl || "").trim();
  const finalPortfolio = (portfolio || portfolioUrl || "").trim();
  const finalResume = (resumeUrl || "").trim();
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const applicationId = `KN-INT-${year}-${generateRandomSuffix()}`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const applicationDocument = {
    applicationId,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    college: college.trim(),
    degree: (degree || "B.E / B.Tech").trim(),
    department: (department || "Computer Science").trim(),
    academicYear: (academicYear || "3rd Year").trim(),
    internshipTrack: internshipTrack.trim(),
    skills: finalSkills,
    github: finalGithub,
    portfolio: finalPortfolio,
    motivation: finalMotivation,
    resumeUrl: finalResume,
    status: "New",
    emailStatus: "pending",
    createdAt: now,
    updatedAt: now
  };
  try {
    const { db } = await connectToDatabase();
    if (db) {
      await db.collection("internshipApplications").insertOne(applicationDocument);
      console.log(`[DB] Successfully stored internship application ${applicationId} in MongoDB Atlas.`);
    } else {
      console.warn(`[DB] Database connection unavailable for application ${applicationId}.`);
    }
  } catch (dbErr) {
    console.error("[DB] Warning: Could not write internship application to MongoDB Atlas (check 0.0.0.0/0 IP access in Atlas):", dbErr?.message || dbErr);
  }
  let emailDeliveryStatus = "failed";
  let emailErrorMsg = void 0;
  let emailSentAt = void 0;
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
    console.error("[EMAIL] Error dispatching internship application email:", emailErr);
    emailDeliveryStatus = "failed";
    emailErrorMsg = emailErr.message || "Email delivery exception";
  }
  try {
    const { db } = await connectToDatabase();
    if (db) {
      await db.collection("internshipApplications").updateOne(
        { applicationId },
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
    console.error("[DB] Failed updating email status for internship in MongoDB:", updateErr);
  }
  return {
    status: 200,
    body: {
      success: true,
      message: "Thank you for applying to the Kryptonode Online Internship Program.",
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
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
  const result = await handleInternshipApplication(req.body);
  return res.status(result.status).json(result.body);
}
export {
  handler as default,
  handleInternshipApplication
};
