import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { store } from '@/lib/store';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, phone, password } = await req.json();

    if (!username || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!/^(\+254|0)[17]\d{8}$/.test(phone)) {
      return NextResponse.json({ error: 'Enter a valid Kenyan phone number' }, { status: 400 });
    }

    // Check if username or phone exists
    for (const user of store.users.values()) {
      if (user.username === username) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }
      if (user.phone === phone) {
        return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = uuidv4();

    store.users.set(id, {
      id,
      username,
      phone,
      passwordHash,
      balance: 0,
      tier: 'free',
      assessmentPassed: false,
      bonusClaimed: false,
      completedTasks: [],
      createdAt: new Date().toISOString(),
    });

    const token = signToken(id);
    const response = NextResponse.json({ success: true, userId: id });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
