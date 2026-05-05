'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import s from './bonus.module.css';

export default function BonusPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/user', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ claimBonus: true }) });
      const data = await res.json();
      if (res.ok) setBalance(data.balance);
      else router.push('/auth/login');
    })();
  }, [router]);

  return (
    <div className={s.bonus}>
      <div className={s.bonus__icon}>🎁</div>
      <h1 className={s.bonus__title}>Bonus Credited!</h1>
      <p className={s.bonus__sub}>Your signup reward has been added to your account.</p>

      <div className={s.bonus__card}>
        <div className={s.bonus__amount}>KSh 100</div>
        <div className={s.bonus__amount_label}>Signup Bonus</div>

        <div className={s.bonus__balance_row}>
          <span className={s.bonus__balance_label}>Your Balance</span>
          <span className={s.bonus__balance_val}>
            {balance === null ? '…' : `KSh ${balance}`}
          </span>
        </div>
      </div>

      <button
        className={s.bonus__btn}
        onClick={async () => { setLoading(true); router.push('/dashboard'); }}
        disabled={loading}
      >
        {loading ? 'Loading…' : 'Go to Dashboard →'}
      </button>
    </div>
  );
}
