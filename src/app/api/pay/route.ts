import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser } from '@/lib/auth';

const PACKAGES: Record<string, { tier: string; amount: number; label: string }> = {
  beginner: { tier: 'beginner', amount: 11000, label: 'Beginner' },   // KSh 110 in kobo
  skilled:  { tier: 'skilled',  amount: 13000, label: 'Average Skilled' },
  expert:   { tier: 'expert',   amount: 15000, label: 'Expert' },
  elite:    { tier: 'elite',    amount: 20000, label: 'Elite' },
};

// Initialize Paystack transaction
export async function POST(req: NextRequest) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = store.users.get(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { packageId, email } = await req.json();
  const pkg = PACKAGES[packageId];
  if (!pkg) return NextResponse.json({ error: 'Invalid package' }, { status: 400 });

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

  // If no Paystack key, simulate payment (dev mode)
  if (!paystackSecret || paystackSecret.includes('your_paystack')) {
    // Simulate success for demo
    user.tier = pkg.tier as typeof user.tier;
    store.users.set(userId, user);
    return NextResponse.json({
      success: true,
      demo: true,
      message: 'Demo mode: Payment simulated successfully',
      tier: pkg.tier,
    });
  }

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || `${user.phone}@businesshub.app`,
        amount: pkg.amount,
        currency: 'KES',
        metadata: {
          userId,
          packageId,
          packageLabel: pkg.label,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}/payment/verify`,
        channels: ['mobile_money', 'card'],
      }),
    });

    const data = await response.json();
    if (!data.status) {
      return NextResponse.json({ error: data.message || 'Payment init failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Payment service error' }, { status: 500 });
  }
}

// Verify Paystack payment
export async function GET(req: NextRequest) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');
  if (!reference) return NextResponse.json({ error: 'Reference required' }, { status: 400 });

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecret || paystackSecret.includes('your_paystack')) {
    return NextResponse.json({ error: 'Paystack not configured' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });
    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      const { userId: metaUserId, packageId } = data.data.metadata;
      const pkg = PACKAGES[packageId];
      const user = store.users.get(metaUserId);
      if (user && pkg) {
        user.tier = pkg.tier as typeof user.tier;
        store.users.set(metaUserId, user);
      }
      return NextResponse.json({ success: true, tier: pkg?.tier });
    }

    return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Verification error' }, { status: 500 });
  }
}
