import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { sendConfirmationEmail } from '@/lib/email';
import QRCode from 'qrcode';

// Helper to generate a random 8-character alphanumeric code
function generateAlphanumericCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  try {
    // 1. Authenticate Admin
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Runner ID is required' }, { status: 400 });
    }

    // 2. Fetch current status and check if runner exists
    const runnerRes = await query('SELECT id, status, email, name FROM runners WHERE id = $1', [id]);
    if (runnerRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Runner not found' }, { status: 404 });
    }

    const runner = runnerRes.rows[0];
    if (runner.status !== 'pending') {
      return NextResponse.json({
        success: false,
        error: `Runner is already in ${runner.status} status`
      }, { status: 400 });
    }

    // 3. Generate unique registration code (ensure it's unique in the DB)
    let registrationCode = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      registrationCode = generateAlphanumericCode(8);
      const codeCheck = await query('SELECT id FROM runners WHERE registration_code = $1', [registrationCode]);
      if (codeCheck.rowCount === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({
        success: false,
        error: 'Could not generate a unique registration code. Please try again.'
      }, { status: 500 });
    }

    // 4. Generate QR Code
    // The scanned QR code redirects the admin to the checkin page for that code
    const url = new URL(request.url);
    const checkinUrl = `${url.protocol}//${url.host}/admin/checkin?code=${registrationCode}`;
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(checkinUrl, {
        margin: 1,
        width: 300,
        color: {
          dark: '#1e293b', // Dark Gray
          light: '#ffffff' // White
        }
      });
    } catch (qrErr) {
      console.error('QR code generation failed:', qrErr);
    }

    // 5. Update database status
    const updateSql = `
      UPDATE runners 
      SET status = 'verified', registration_code = $1, verified_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING id, name, email, registration_code
    `;
    const updateResult = await query(updateSql, [registrationCode, id]);
    const updatedRunner = updateResult.rows[0];

    // 6. Send confirmation email (contains registration code and embedded QR Code image)
    try {
      await sendConfirmationEmail(updatedRunner.email, updatedRunner.name, updatedRunner.registration_code, qrCodeDataUrl);
    } catch (emailErr) {
      console.error('Failed to send verification confirmation email:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Runner payment verified successfully',
      runner: {
        id: updatedRunner.id,
        name: updatedRunner.name,
        email: updatedRunner.email,
        registration_code: updatedRunner.registration_code,
        status: 'verified'
      }
    });

  } catch (error) {
    console.error('Admin verify API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
