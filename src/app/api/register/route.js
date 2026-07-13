import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendVerificationPendingEmail } from '@/lib/email';
import { getRegistrationPeriod } from '@/lib/registrationPeriods';
import crypto from 'crypto';

export async function POST(request) {
  try {
    // Backend validation of registration period
    const period = getRegistrationPeriod(new Date());
    if (!period.formActive) {
      return NextResponse.json({ success: false, error: period.message }, { status: 400 });
    }

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
      emergency_contact_number,
      tshirt_size,
      payment_screenshot,
      blood_type,
      doct_recommendation,
      info_source,
      prev_diagnose,
      prev_alergy,
      approval,
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
      emergency_contact_number: 'Nomor kontak darurat wajib diisi',
      tshirt_size: 'Ukuran kaos wajib dipilih',
      payment_screenshot: 'Bukti pembayaran wajib diunggah',
      blood_type: 'Golongan darah wajib dipilih',
      doct_recommendation: 'Informasi rekomendasi dokter wajib dipilih',
      approval: 'Pernyataan persetujuan wajib diisi',
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
    
    const bloodType = ["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"]
    if (!bloodType.includes(blood_type)) {
      return NextResponse.json({ success: false, error: 'Golongan darah tidak valid' }, { status: 400 });
    }
    // Generate UUID v4 in JavaScript for MySQL compatibility
    const uuid = crypto.randomUUID();

    // MySQL INSERT query with '?' parameter placeholders
    const sql = `
      INSERT INTO runners (
        uuid, competition_type, name, email, whatsapp, gender, birth_place, birth_date,
        identity_type, identity_number, bib_name, emergency_contact_name,
        emergency_contact_relationship, emergency_contact_number, tshirt_size, payment_screenshot,
        payment_period, payment_amount, blood_type, doct_recommendation, info_source, prev_diagnose, prev_alergy, approval
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      uuid,
      competition_type.trim(),
      name.trim(),
      email.trim().toLowerCase(),
      whatsapp.trim(),
      gender.trim(),
      birth_place.trim(),
      birth_date, // Date string is auto-parsed by MySQL
      identity_type.trim(),
      identity_number.trim(),
      bib_name.trim(),
      emergency_contact_name.trim(),
      emergency_contact_relationship.trim(),
      emergency_contact_number.trim(),
      tshirt_size.trim(),
      payment_screenshot,
      period.status,
      period.price,
      blood_type,
      doct_recommendation.toLowerCase() === "ya",
      info_source,
      prev_diagnose,
      prev_alergy,
      true,
    ];

    const dbResult = await query(sql, values);
    const newRunnerId = dbResult.insertId;

    // Construct the runner info object directly
    const newRunner = {
      id: newRunnerId,
      uuid,
      name: name.trim(),
      status: 'pending',
      sex: gender.trim(),
      birthLoc: birth_place.trim(),
      birthDate: new Date(birth_date).toLocaleDateString('id-ID'),
      identity: identity_type.trim(),
      identityNumber: identity_number.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      bibName: bib_name.trim(),
      tshirtSize: tshirt_size.trim().toUpperCase(),
      bloodType: blood_type,
      doctRecommendation: doct_recommendation,
      prevDiagnose: prev_diagnose,
      prevAlergy: prev_alergy,
      emergencyContact: emergency_contact_name.trim(),
      emergencyContactRelationship: emergency_contact_relationship.trim(),
      emergencyContactNumber: emergency_contact_number.trim(),
      eventSource: info_source.trim(),
      competition_type: competition_type.trim(),
      registered_at: new Date(),
    };

    let isSuccess = false

    // Trigger verification pending email asynchronously
    try {
      await sendVerificationPendingEmail(newRunner);

      await query(`UPDATE runners SET email_status = ? WHERE id = ?`, ['success', newRunnerId])
      isSuccess = true
    } catch (emailErr) {
      console.error('Registration email sending failed (proceeding with registration):', emailErr);
    }


    if (!isSuccess) {
      await query(`UPDATE runners SET email_status = ? WHERE id = ?`, ['failed', newRunnerId])
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
