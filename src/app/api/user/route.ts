import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = store.users.get(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({
    id: user.id,
    username: user.username,
    phone: user.phone,
    balance: user.balance,
    tier: user.tier,
    assessmentPassed: user.assessmentPassed,
    bonusClaimed: user.bonusClaimed,
  });
}

export async function PATCH(req: NextRequest) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = store.users.get(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();

  if (body.assessmentPassed !== undefined) user.assessmentPassed = body.assessmentPassed;
  if (body.claimBonus && !user.bonusClaimed) {
    user.bonusClaimed = true;
    user.balance += 100;
  }

  store.users.set(userId, user);
  return NextResponse.json({ success: true, balance: user.balance });
}
