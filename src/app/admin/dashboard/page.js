import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const admin = verifyToken(token);

  if (!admin) {
    redirect('/admin/login');
  }

  // Fetch all runners directly in Server Component (direct SQL, no ORM)
  let runners = [];
  try {
    const res = await query(
      `SELECT 
        id, uuid, competition_type, name, email, whatsapp, gender, birth_place, birth_date, 
        identity_type, identity_number, bib_name, emergency_contact_name, 
        emergency_contact_relationship, emergency_contact_number, tshirt_size, status, registration_code,
        registered_at, verified_at, bag_distributed_at, payment_period, payment_amount, blood_type, doct_recommendation,
        info_source, prev_diagnose, prev_alergy, email_status  
      FROM runners 
      ORDER BY id DESC`
    );
    // Convert date objects to ISO/string formats for safe serialization to Client Component
    runners = res.rows.map(row => ({
      ...row,
      birth_date: row.birth_date ? (row.birth_date instanceof Date ? row.birth_date.toISOString().split('T')[0] : row.birth_date) : null,
      registered_at: row.registered_at ? row.registered_at.toISOString() : null,
      verified_at: row.verified_at ? row.verified_at.toISOString() : null,
      bag_distributed_at: row.bag_distributed_at ? row.bag_distributed_at.toISOString() : null,
    }));
  } catch (error) {
    console.error('Failed to fetch runners for admin dashboard:', error);
  }

  return <DashboardClient initialRunners={runners} />;
}
