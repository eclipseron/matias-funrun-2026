import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendVerificationPendingEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      competition_type,
      name, 
      email, 
      whatsapp,
      gender,
      birth_place,
      birth_date,
      identity_type,
      identity_number,
      bib_name,
      emergency_contact_name,
      emergency_contact_relationship,
      tshirt_size,
      payment_screenshot 
    } = body;

    // Validation
    const requiredFields = {
      competition_type: 'Tipe kompetisi harus dipilih',
      name: 'Nama lengkap wajib diisi',
      email: 'Email wajib diisi',
      whatsapp: 'Nomor WhatsApp wajib diisi',
      gender: 'Jenis kelamin wajib dipilih',
      birth_place: 'Tempat lahir wajib diisi',
      birth_date: 'Tanggal lahir wajib diisi',
      identity_type: 'Jenis identitas wajib dipilih',
      identity_number: 'Nomor identitas wajib diisi',
      bib_name: 'Nama BIB wajib diisi',
      emergency_contact_name: 'Nama kontak darurat wajib diisi',
      emergency_contact_relationship: 'Hubungan kontak darurat wajib diisi',
      tshirt_size: 'Ukuran kaos wajib dipilih',
      payment_screenshot: 'Bukti pembayaran wajib diunggah'
    };

    for (const [key, message] of Object.entries(requiredFields)) {
      const val = body[key];
      if (!val || (typeof val === 'string' && !val.trim())) {
        return NextResponse.json({ success: false, error: message }, { status: 400 });
      }
    }

    if (!email.trim() || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Format email tidak valid' }, { status: 400 });
    }

    // Insert runner details into database
    const sql = `
      INSERT INTO runners (
        competition_type, name, email, whatsapp, gender, birth_place, birth_date,
        identity_type, identity_number, bib_name, emergency_contact_name,
        emergency_contact_relationship, tshirt_size, payment_screenshot
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, uuid, name, email, status, registered_at
    `;

    const values = [
      competition_type.trim(),
      name.trim(),
      email.trim().toLowerCase(),
      whatsapp.trim(),
      gender.trim(),
      birth_place.trim(),
      birth_date, // Date string is automatically parsed by postgres
      identity_type.trim(),
      identity_number.trim(),
      bib_name.trim(),
      emergency_contact_name.trim(),
      emergency_contact_relationship.trim(),
      tshirt_size.trim(),
      payment_screenshot
    ];

    const dbResult = await query(sql, values);
    const newRunner = dbResult.rows[0];

    // Trigger verification pending email asynchronously
    try {
      await sendVerificationPendingEmail(newRunner.email, newRunner.name);
    } catch (emailErr) {
      console.error('Registration email sending failed (proceeding with registration):', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dikirim',
      runner: {
        id: newRunner.id,
        uuid: newRunner.uuid,
        name: newRunner.name,
        email: newRunner.email,
        status: newRunner.status,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error handling runner registration API:', error);
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan sistem saat memproses pendaftaran. Silakan coba lagi.'
    }, { status: 500 });
  }
}
