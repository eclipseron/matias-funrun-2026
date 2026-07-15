import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const token = request.cookies.get('admin_session')?.value;
    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    // Soft delete: is_active = 0, deleted_at = now
    await query(
      `UPDATE runners SET is_active = 0, deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inactivate error:', error);
    return NextResponse.json({ success: false, error: 'Failed to inactivate runner.' }, { status: 500 });
  }
}
