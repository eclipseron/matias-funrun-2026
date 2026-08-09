import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { sendConfirmationEmail } from '@/lib/email';
// import QRCode from 'qrcode';
import crypto from 'crypto';

// Helper to generate a random 8-character alphanumeric code
function generateAlphanumericCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(crypto.randomInt(chars.length));
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

    if (!id || !Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Valid Runner ID is required' }, { status: 400 });
    }

    // 2. Fetch current status and check if runner exists (MySQL ? placeholder)
    const runnerRes = await query('SELECT id, status, email, name FROM runners WHERE id = ?', [id]);
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

    // 3. Generate unique registration code (MySQL ? placeholder)
    let registrationCode = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      registrationCode = generateAlphanumericCode(8);
      const codeCheck = await query('SELECT id FROM runners WHERE registration_code = ?', [registrationCode]);
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
    const url = new URL(request.url);
    const checkinUrl = `${url.protocol}//${url.host}/admin/checkin?code=${registrationCode}`;
    // let qrCodeDataUrl = '';
    // try {
    //   qrCodeDataUrl = await QRCode.toDataURL(checkinUrl, {
    //     margin: 1,
    //     width: 300,
    //     color: {
    //       dark: '#1e293b', // Dark Gray
    //       light: '#ffffff' // White
    //     }
    //   });
    // } catch (qrErr) {
    //   console.error('QR code generation failed:', qrErr);
    // }

    // 5. Update database status in MySQL (split into UPDATE then SELECT due to lack of RETURNING clause)
    const updateSql = `
      UPDATE runners 
      SET status = 'verified', registration_code = ?, verified_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await query(updateSql, [registrationCode, id]);

    const selectSql = `
      SELECT id, uuid, name, email, whatsapp, gender, identity_number, competition_type, tshirt_size, registration_code, registered_at, bib_name
      FROM runners 
      WHERE id = ?
    `;
    const selectResult = await query(selectSql, [id]);
    const updatedRunner = selectResult.rows[0];
    let isSuccess = false

    // 6. Send confirmation email (contains registration code and embedded QR Code image)
    try {
      await sendConfirmationEmail({
        email: updatedRunner.email,
        name: updatedRunner.name,
        uuid: updatedRunner.uuid,
        whatsapp: updatedRunner.whatsapp,
        gender: updatedRunner.gender,
        identity_number: updatedRunner.identity_number,
        competition_type: updatedRunner.competition_type,
        tshirt_size: updatedRunner.tshirt_size,
        registration_code: updatedRunner.registration_code,
        registered_at: updatedRunner.registered_at,
        bib_name: updatedRunner.bib_name,
      });
      await query(`UPDATE runners SET email_status = ? WHERE id = ?`, ['success', id])
      isSuccess = true
    } catch (emailErr) {
      console.error('Failed to send verification confirmation email:', emailErr);
    }

    if (!isSuccess) {
      await query(`UPDATE runners SET email_status = ? WHERE id = ?`, ['failed', id])
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
