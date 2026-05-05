'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import s from './page.module.css';

export default function LandingPage() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  return (
    <div className={s.land}>
      {/* Nav */}
      <nav className={s.land__nav}>
        <div className={s.land__logo}>Business<span>Hub</span></div>
        <a href="/auth/login" className={s.land__nav_link}>Sign In</a>
      </nav>

      {/* Hero */}
      <section className={s.land__hero}>
        <div className={s.land__badge}>🇰🇪 Made for Kenya &amp; Africa</div>
        <h1 className={s.land__title}>
          Welcome to the<br /><em>future of earning</em>
        </h1>
        <p className={s.land__tagline}>
          Complete simple AI training tasks and earn real money — withdraw directly to M-Pesa or PayPal.
        </p>

        <div className={s.land__stats}>
          <div>
            <div className={s.land__stat_num}>KSh 100</div>
            <div className={s.land__stat_label}>Signup Bonus</div>
          </div>
          <div>
            <div className={s.land__stat_num}>50+</div>
            <div className={s.land__stat_label}>Tasks Available</div>
          </div>
          <div>
            <div className={s.land__stat_num}>M-Pesa</div>
            <div className={s.land__stat_label}>Instant Withdrawal</div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <div className={s.land__grid}>
        {/* Welcome Card */}
        <div className={s.land__card}>
          <div className={s.land__card_icon}>🤖</div>
          <h2 className={s.land__card_title}>Welcome to the future of earning</h2>
          <p className={s.land__card_desc}>Complete simple AI training tasks and earn real money. No special skills required — just your time and attention.</p>
          <div className={s.land__tasks}>
            {['Text Annotation', 'Classification', 'Clarification', 'Sentiment'].map(t => (
              <span key={t} className={s.land__task_chip}>{t}</span>
            ))}
          </div>
        </div>

        {/* Features Card */}
        <div className={s.land__card}>
          <div className={s.land__card_icon}>⚡</div>
          <h2 className={s.land__card_title}>Why Business Hub?</h2>
          <p className={s.land__card_desc}>The most flexible earning platform built for Africa.</p>
          <div className={s.land__features}>
            <div className={s.land__feature}>
              <div className={s.land__feature_dot}></div>
              <span><strong>Instant Payout</strong> — Withdraw to M-Pesa or PayPal</span>
            </div>
            <div className={s.land__feature}>
              <div className={s.land__feature_dot}></div>
              <span><strong>Work Anywhere</strong> — Phone or laptop, any time</span>
            </div>
            <div className={s.land__feature}>
              <div className={s.land__feature_dot}></div>
              <span><strong>KSh 100 Bonus</strong> — Credited on signup</span>
            </div>
            <div className={s.land__feature}>
              <div className={s.land__feature_dot}></div>
              <span><strong>Real Tasks</strong> — Used by top AI companies</span>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className={s.land__cta_card}>
          <div className={s.land__card_icon} style={{background:'rgba(212,168,71,0.1)'}}>🚀</div>
          <h2 className={s.land__card_title}>Start Earning Today</h2>
          <p className={s.land__card_desc}>Join thousands of Kenyans already earning with Business Hub.</p>
          <label className={s.land__check_label}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </label>
          <button
            className={`${s.land__btn_primary} ${s['--gold']}`}
            disabled={!agreed}
            onClick={() => router.push('/auth/signup')}
          >
            Create Account — It&apos;s Free
          </button>
          <div className={s.land__signin}>
            Already have an account? <a href="/auth/login">Sign In</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={s.land__footer}>
        © {new Date().getFullYear()} Business Hub. Earn money by training AI and digital creations.
      </footer>
    </div>
  );
}
