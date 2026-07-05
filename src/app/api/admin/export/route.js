import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import * as XLSX from 'xlsx';

// Helper to calculate age from birthdate
function calculateAge(birthDateString) {
  if (!birthDateString) return '';
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export async function GET(request) {
  try {
    // 1. Authenticate Admin
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const admin = verifyToken(token);
    if (!admin) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch all runners with all personal details ordered by ID
    const sql = `
      SELECT 
        id, uuid, competition_type, name, email, whatsapp, gender, birth_place, birth_date, 
        identity_type, identity_number, bib_name, emergency_contact_name, 
        emergency_contact_relationship, tshirt_size, status, registration_code, 
        registered_at, verified_at, bag_distributed_at 
      FROM runners 
      ORDER BY id ASC
    `;
    const dbResult = await query(sql);

    // 3. Format rows with new Indonesian localized columns
    const rows = dbResult.rows.map(row => ({
      'ID Database': row.id,
      'UUID Peserta': row.uuid,
      'Kategori Kompetisi': row.competition_type,
      'Nama Lengkap': row.name,
      'Email': row.email,
      'Nomor WhatsApp': row.whatsapp,
      'Jenis Kelamin': row.gender,
      'Tempat Lahir': row.birth_place,
      'Tanggal Lahir': row.birth_date ? new Date(row.birth_date).toLocaleDateString('id-ID') : '',
      'Umur (Tahun)': row.birth_date ? calculateAge(row.birth_date) : '',
      'Jenis Identitas': row.identity_type,
      'Nomor Identitas': row.identity_number,
      'Nama BIB': row.bib_name,
      'Ukuran Jersey': row.tshirt_size,
      'Nama Kontak Darurat': row.emergency_contact_name,
      'Hubungan Kontak Darurat': row.emergency_contact_relationship,
      'Status Pendaftaran': row.status.toUpperCase(),
      'Kode Registrasi': row.registration_code || 'N/A',
      'Tanggal Registrasi': row.registered_at ? new Date(row.registered_at).toLocaleString('id-ID') : '',
      'Tanggal Verifikasi': row.verified_at ? new Date(row.verified_at).toLocaleString('id-ID') : '',
      'Tanggal Pengambilan Bag': row.bag_distributed_at ? new Date(row.bag_distributed_at).toLocaleString('id-ID') : ''
    }));

    // 4. Generate worksheet and workbook using sheetjs (xlsx)
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendaftar');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // 5. Send file response with correct Excel content-types
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="pendaftaran_matias_funrun_walk_2026.xlsx"',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('Excel Export API error:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
