'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import s from './payment.module.css';

const PACKAGES: Record<string, { name: string; price: number }> = {
  beginner: { name: 'Beginner',       price: 110 },
  skilled:  { name: 'Average Skilled', price: 130 },
  expert:   { name: 'Expert',          price: 150 },
  elite:    { name: 'Elite',           price: 200 },
};

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package') || 'beginner';
  const pkg = PACKAGES[packageId] || PACKAGES.beginner;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePay = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      if (data.demo) {
        setSuccess('✅ Demo payment successful! Your account has been upgraded.');
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.pay}>
      <button className={s.pay__back} onClick={() => router.push('/upgrade')}>← Back to Packages</button>

      <div className={s.pay__card}>
        <div className={s.pay__secure}>🔒 Secure Payment via Paystack</div>

        <h1 className={s.pay__title}>Complete Your Upgrade</h1>
        <p className={s.pay__sub}>You&apos;re one step away from unlocking all AI training tasks.</p>

        <div className={s.pay__pkg}>
          <div>
            <div className={s.pay__pkg_name}>{pkg.name} Package</div>
            <div style={{fontSize:'0.8rem',color:'#64748b',marginTop:'0.2rem'}}>All tasks unlocked</div>
          </div>
          <div className={s.pay__pkg_price}>KSh {pkg.price}</div>
        </div>

        {error && <div className={s.pay__error}>⚠️ {error}</div>}
        {success && <div className={s.pay__success}>{success}</div>}

        <div className={s.pay__field}>
          <label className={s.pay__label}>Email Address</label>
          <input
            className={s.pay__input}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <span className={s.pay__hint}>Payment receipt will be sent here</span>
        </div>

        <button
          className={s.pay__btn}
          onClick={handlePay}
          disabled={loading || !!success}
        >
          {loading ? 'Processing…' : `Pay KSh ${pkg.price} via M-Pesa / Card`}
        </button>

        <div className={s.pay__trust}>
          <span className={s.pay__trust_item}>🛡️ SSL Secured</span>
          <span className={s.pay__trust_item}>📱 M-Pesa Supported</span>
          <span className={s.pay__trust_item}>🔄 Instant Activation</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f8fafc',fontFamily:'DM Sans,sans-serif',color:'#64748b'}}>Loading…</div>}>
      <PaymentForm />
    </Suspense>
  );
}
