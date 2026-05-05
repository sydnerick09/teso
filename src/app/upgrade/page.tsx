'use client';
import { useRouter } from 'next/navigation';
import s from './upgrade.module.css';

const packages = [
  {
    id: 'beginner',
    icon: '🌱',
    name: 'Beginner',
    price: 110,
    earn: 800,
    color: '--b',
    features: ['Access to all 50 tasks', 'Up to KSh 800 earnings', 'Text annotation tasks', 'Email support'],
  },
  {
    id: 'skilled',
    icon: '⚡',
    name: 'Average Skilled',
    price: 130,
    earn: 1500,
    color: '--s',
    popular: true,
    features: ['All Beginner features', 'Up to KSh 1,500 earnings', 'Priority task queue', 'Classification tasks', 'Chat support'],
  },
  {
    id: 'expert',
    icon: '🎯',
    name: 'Expert',
    price: 150,
    earn: 2000,
    color: '--e',
    features: ['All Skilled features', 'Up to KSh 2,000 earnings', 'Expert-level tasks', 'Bonus reward multiplier', 'Priority support'],
  },
  {
    id: 'elite',
    icon: '👑',
    name: 'Elite',
    price: 200,
    earn: 4000,
    color: '--el',
    features: ['All Expert features', 'Up to KSh 4,000 earnings', 'Elite tasks', '2× reward multiplier', '24/7 dedicated support'],
  },
];

export default function UpgradePage() {
  const router = useRouter();

  return (
    <div className={s.upgrade}>
      <button className={s.upgrade__back} onClick={() => router.push('/dashboard')}>← Back to Dashboard</button>

      <div className={s.upgrade__header}>
        <h1 className={s.upgrade__title}>Unlock Your Earning Potential</h1>
        <p className={s.upgrade__sub}>Choose a package to access all 50 tasks and maximize your earnings. One-time upgrade — no recurring fees.</p>
      </div>

      <div className={s.upgrade__grid}>
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`${s.upgrade__card} ${pkg.popular ? s['--popular'] : ''}`}
            onClick={() => router.push(`/payment?package=${pkg.id}`)}
          >
            {pkg.popular && <div style={{height:'1.5rem'}}></div>}
            <div className={s.upgrade__tier_icon}>{pkg.icon}</div>
            <div className={s.upgrade__tier_name}>{pkg.name}</div>

            <div className={s.upgrade__price}>KSh {pkg.price}</div>
            <div className={s.upgrade__price_sub}>One-time payment</div>

            <div className={s.upgrade__divider}></div>

            <div className={s.upgrade__earn}>
              <div className={s.upgrade__earn_label}>Potential Earnings</div>
              <div className={s.upgrade__earn_val}>Up to KSh {pkg.earn.toLocaleString()}</div>
            </div>

            <div className={s.upgrade__features}>
              {pkg.features.map((f, i) => (
                <div key={i} className={s.upgrade__feature}>
                  <span className={s.upgrade__feature_check}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button className={`${s.upgrade__btn} ${s[pkg.color as keyof typeof s]}`}>
              Choose {pkg.name} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
