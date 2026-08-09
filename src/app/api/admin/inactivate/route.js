import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id || !Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Valid ID is required' }, { status: 400 });
    }

    // Soft delete: is_active = 0, deleted_at = now
    const result = await query(
      `UPDATE runners SET is_active = 0, deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inactivate error:', error);
    return NextResponse.json({ success: false, error: 'Failed to inactivate runner.' }, { status: 500 });
  }
}
