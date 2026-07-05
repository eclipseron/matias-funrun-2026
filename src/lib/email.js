import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'emails.log');

/**
 * Sends an email using SMTP or logs it to file/console.
 * 
 * @param {Object} options - Email sending options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text content
 */
export async function sendEmail({ to, subject, html, text }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"Petrus Aria" <petrusariacr25@gmail.com>';

  // Fallback to console + file logging in development or if SMTP is missing
  if (!host) {
    const logEntry = `
========================================
[EMAIL SENT]
Timestamp: ${new Date().toISOString()}
To: ${to}
From: ${from}
Subject: ${subject}
----------------------------------------
TEXT CONTENT:
${text || 'No plain text content provided'}
----------------------------------------
HTML CONTENT:
${html}
========================================
\n`;
    console.log(logEntry);
    try {
      fs.appendFileSync(logFilePath, logEntry, 'utf8');
      console.log(`Email logged successfully to ${logFilePath}`);
    } catch (err) {
      console.error(`Failed to write email to ${logFilePath}:`, err);
    }
    return { success: true, logged: true };
  }

  // Attempt real SMTP transport if host is provided
  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || '2525', 10),
      auth: { user, pass },
      secure: port === '465',
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log('SMTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('SMTP Email sending failed. Error details:', error);
    
    // Log failure log entry
    const errorLogEntry = `
========================================
[EMAIL SEND FAILURE]
Timestamp: ${new Date().toISOString()}
To: ${to}
Subject: ${subject}
Error: ${error.message}
========================================
\n`;
    try {
      fs.appendFileSync(logFilePath, errorLogEntry, 'utf8');
    } catch (err) {}
    throw error;
  }
}

/**
 * Sends verification pending email to the runner immediately after registration.
 */
export async function sendVerificationPendingEmail(email, name) {
  const subject = 'Registration Under Verification - Matias Fun Run 2026';
  const text = `Hello ${name},\n\nThank you for registering for the Matias Fun Run 2026! We have received your registration details and payment screenshot.\n\nYour registration is currently on verification process. You can expect a confirmation email containing your registration code in the next 3 days.\n\nBest regards,\nMatias Fun Run Team`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1f2937; border-top: 5px solid #16a34a; background-color: #ffffff; color: #1f2937;">
      <h2 style="color: #1f2937; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Matias Fun Run 2026</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for registering for the Matias Fun Run 2026! We have successfully received your registration details and payment screenshot.</p>
      <div style="background-color: #f3f4f6; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; color: #16a34a;">Status: Under Verification</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Our administrator is currently verifying your payment. You will receive a confirmation email with your unique registration code in the next 3 days.</p>
      </div>
      <p>If you have any questions, please contact our service desk (support@matiasfunrun.com / +62-812-3456-7890).</p>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px;">This is an automated email. Please do not reply directly to this message.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
}

/**
 * Sends verification confirmation email containing registration code and QR code.
 */
export async function sendConfirmationEmail(email, name, registrationCode, qrCodeDataUrl) {
  const subject = 'Registration Verified! Your Registration Code - Matias Fun Run 2026';
  const text = `Hello ${name},\n\nGreat news! Your payment has been verified, and your registration is complete.\n\nYour unique Registration Code is: ${registrationCode}\n\nPlease save this code and show it at the location on the running bag distribution day to receive your running bag.\n\nBest regards,\nMatias Fun Run Team`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1f2937; border-top: 5px solid #16a34a; background-color: #ffffff; color: #1f2937;">
      <h2 style="color: #1f2937; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Registration Verified!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Great news! Your payment has been verified, and your registration is complete.</p>
      
      <div style="text-align: center; background-color: #f9fafb; border: 1px dashed #d1d5db; padding: 20px; margin: 25px 0; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em;">Your Registration Code</p>
        <h1 style="margin: 10px 0; font-size: 36px; font-weight: 800; color: #1f2937; letter-spacing: 0.1em; font-family: monospace;">${registrationCode}</h1>
        
        ${qrCodeDataUrl ? `
          <div style="margin: 20px auto 10px auto; width: 180px; height: 180px; background-color: #ffffff; border: 1px solid #e5e7eb; padding: 10px; display: inline-block;">
            <img src="${qrCodeDataUrl}" alt="Check-in QR Code" style="width: 180px; height: 180px; display: block;" />
          </div>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Show this QR code or code at the check-in desk to collect your running bag.</p>
        ` : ''}
      </div>

      <div style="background-color: #f3f4f6; border-left: 4px solid #1f2937; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h4 style="margin: 0 0 5px 0; color: #1f2937; font-size: 14px; font-weight: bold;">Running Bag Collection Info</h4>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
          <strong>Date:</strong> Friday to Saturday (prior to race day)<br/>
          <strong>Location:</strong> Main Stadium Gate B Service Desk<br/>
          <strong>Requirements:</strong> Show this email (or QR code / registration code) to the registration counter staff.
        </p>
      </div>

      <p>If you have any questions, please contact our service desk (support@matiasfunrun.com / +62-812-3456-7890).</p>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px;">This is an automated email. Please do not reply directly to this message.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
}
