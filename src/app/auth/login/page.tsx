'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import s from '../signup/signup.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      const u = data.user;
      if (!u.assessmentPassed) router.push('/assessment');
      else if (!u.bonusClaimed) router.push('/bonus');
      else router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.auth}>
      <div className={s.auth__logo}>BusinessHub</div>
      <div className={s.auth__card}>
        <h1 className={s.auth__title}>Welcome back</h1>
        <p className={s.auth__sub}>Sign in to continue earning.</p>

        {error && <div className={s.auth__error}>{error}</div>}

        <div className={s.auth__field}>
          <label className={s.auth__label}>Phone Number</label>
          <input
            className={s.auth__input}
            placeholder="+254712345678"
            value={form.phone}
            onChange={e => setForm(f => ({...f, phone: e.target.value}))}
          />
        </div>
        <div className={s.auth__field}>
          <label className={s.auth__label}>Password</label>
          <input
            className={s.auth__input}
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={e => setForm(f => ({...f, password: e.target.value}))}
          />
        </div>

        <button className={s.auth__btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>

        <div className={s.auth__footer}>
          Don&apos;t have an account? <a href="/auth/signup">Create one free</a>
        </div>
      </div>
    </div>
  );
}
