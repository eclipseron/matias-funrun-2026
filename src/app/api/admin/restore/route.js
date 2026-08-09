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

    // Restore: is_active = 1, deleted_at = null
    const result = await query(
      `UPDATE runners SET is_active = 1, deleted_at = NULL WHERE id = ?`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json({ success: false, error: 'Failed to restore runner.' }, { status: 500 });
  }
}
