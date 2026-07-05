import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

// GET: Lookup runner by registration code
export async function GET(request) {
  try {
    // 1. Authenticate Admin
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code || !code.trim()) {
      return NextResponse.json({ success: false, error: 'Registration code is required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // 2. Fetch runner by registration code (includes payment_screenshot to let admin review check-in details)
    const runnerRes = await query(
      `SELECT id, uuid, name, email, whatsapp, status, registration_code, registered_at, verified_at, bag_distributed_at, payment_screenshot 
       FROM runners 
       WHERE registration_code = $1`, 
      [cleanCode]
    );
    
    if (runnerRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Runner with this registration code not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      runner: runnerRes.rows[0]
    });

  } catch (error) {
    console.error('Admin check-in lookup GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Mark runner's bag as distributed
export async function POST(request) {
  try {
    // 1. Authenticate Admin
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { registration_code } = body;

    if (!registration_code || !registration_code.trim()) {
      return NextResponse.json({ success: false, error: 'Registration code is required' }, { status: 400 });
    }

    const cleanCode = registration_code.trim().toUpperCase();

    // 2. Fetch runner by registration code
    const runnerRes = await query('SELECT * FROM runners WHERE registration_code = $1', [cleanCode]);
    if (runnerRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Runner with this registration code not found' }, { status: 404 });
    }

    const runner = runnerRes.rows[0];

    // 3. Status checks
    if (runner.status === 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Runner payment has not been verified yet. Please verify payment in the dashboard first.'
      }, { status: 400 });
    }

    if (runner.status === 'completed') {
      return NextResponse.json({
        success: false,
        error: 'Running bag has already been distributed for this participant.',
        runner
      }, { status: 400 });
    }

    // 4. Update status to completed (bag distributed)
    const updateSql = `
      UPDATE runners 
      SET status = 'completed', bag_distributed_at = CURRENT_TIMESTAMP 
      WHERE registration_code = $1 
      RETURNING *
    `;
    const updateResult = await query(updateSql, [cleanCode]);
    const updatedRunner = updateResult.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Running bag distributed successfully',
      runner: updatedRunner
    });

  } catch (error) {
    console.error('Admin check-in API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
