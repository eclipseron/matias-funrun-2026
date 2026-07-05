import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function GET(request) {
  try {
    // 1. Authenticate Admin
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get search params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Runner ID is required' }, { status: 400 });
    }

    // 2. Fetch only payment_screenshot text from db (MySQL ? placeholder)
    const dbResult = await query('SELECT id, payment_screenshot FROM runners WHERE id = ?', [id]);
    if (dbResult.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Runner not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      id: dbResult.rows[0].id,
      payment_screenshot: dbResult.rows[0].payment_screenshot
    });

  } catch (error) {
    console.error('Fetch screenshot API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
