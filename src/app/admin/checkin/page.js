import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import CheckinClient from './CheckinClient';

export const dynamic = 'force-dynamic';

export default async function AdminCheckinPage({ searchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const admin = verifyToken(token);

  // Authenticate admin
  if (!admin) {
    const resolvedParams = await searchParams;
    const code = resolvedParams?.code;
    const redirectUrl = code 
      ? `/admin/login?redirect=/admin/checkin?code=${encodeURIComponent(code)}`
      : '/admin/login?redirect=/admin/checkin';
    redirect(redirectUrl);
  }

  // Fetch initial runner if code is present in query parameters (e.g. from QR code scan)
  let initialRunner = null;
  const resolvedParams = await searchParams;
  const code = resolvedParams?.code;
  
  if (code && code.trim()) {
    try {
      const cleanCode = code.trim().toUpperCase();
      const res = await query(
        `SELECT 
          id, uuid, competition_type, name, email, whatsapp, gender, birth_place, birth_date, 
          identity_type, identity_number, bib_name, emergency_contact_name, 
          emergency_contact_relationship, tshirt_size, status, registration_code, 
          registered_at, verified_at, bag_distributed_at, payment_screenshot 
         FROM runners 
         WHERE registration_code = $1`,
        [cleanCode]
      );
      if (res.rowCount > 0) {
        const row = res.rows[0];
        initialRunner = {
          ...row,
          birth_date: row.birth_date ? (row.birth_date instanceof Date ? row.birth_date.toISOString().split('T')[0] : row.birth_date) : null,
          registered_at: row.registered_at ? row.registered_at.toISOString() : null,
          verified_at: row.verified_at ? row.verified_at.toISOString() : null,
          bag_distributed_at: row.bag_distributed_at ? row.bag_distributed_at.toISOString() : null,
        };
      }
    } catch (error) {
      console.error('Failed to fetch initial runner for checkin:', error);
    }
  }

  return <CheckinClient initialRunner={initialRunner} initialCodeQuery={code || ''} />;
}
