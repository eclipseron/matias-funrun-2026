import { NextResponse } from 'next/server';
import { authenticateAdmin, signToken, COOKIE_NAME } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (rateLimit(ip, { windowMs: 60000, max: 10 })) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    // Authenticate administrator against database records
    const admin = await authenticateAdmin(username, password);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }

    // Sign session token containing authenticated admin metadata
    const token = signToken({ 
      id: admin.id,
      name: admin.name,
      username: admin.username 
    });

    // Create JSON response and set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
