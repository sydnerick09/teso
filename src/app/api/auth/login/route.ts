import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { store } from '@/lib/store';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 });
    }

    let foundUser = null;
    for (const user of store.users.values()) {
      if (user.phone === phone) { foundUser = user; break; }
    }

    if (!foundUser) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, foundUser.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken(foundUser.id);
    const response = NextResponse.json({
      success: true,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        balance: foundUser.balance,
        tier: foundUser.tier,
        assessmentPassed: foundUser.assessmentPassed,
        bonusClaimed: foundUser.bonusClaimed,
      }
    });
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
