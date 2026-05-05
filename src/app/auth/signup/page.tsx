'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import s from './signup.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!form.username || !form.phone || !form.password) {
      setError('All fields are required'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/assessment');
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
        <div className={s.auth__progress}>
          <div className={`${s.auth__step} ${s['--active']}`}>1</div>
          <div className={s.auth__step_line}></div>
          <div className={s.auth__step}>2</div>
          <div className={s.auth__step_line}></div>
          <div className={s.auth__step}>3</div>
        </div>
        <h1 className={s.auth__title}>Create your account</h1>
        <p className={s.auth__sub}>Start earning with AI training tasks today.</p>

        {error && <div className={s.auth__error}>{error}</div>}

        <div className={s.auth__field}>
          <label className={s.auth__label}>Username</label>
          <input
            className={s.auth__input}
            placeholder="e.g. john_doe"
            value={form.username}
            onChange={e => setForm(f => ({...f, username: e.target.value}))}
          />
        </div>
        <div className={s.auth__field}>
          <label className={s.auth__label}>Phone Number</label>
          <input
            className={s.auth__input}
            placeholder="+254712345678 or 0712345678"
            value={form.phone}
            onChange={e => setForm(f => ({...f, phone: e.target.value}))}
          />
          <span className={s.auth__hint}>Kenyan phone number format</span>
        </div>
        <div className={s.auth__field}>
          <label className={s.auth__label}>Password</label>
          <input
            className={s.auth__input}
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={e => setForm(f => ({...f, password: e.target.value}))}
          />
        </div>

        <button className={s.auth__btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account →'}
        </button>

        <div className={s.auth__footer}>
          Already have an account? <a href="/auth/login">Sign In</a>
        </div>
      </div>
    </div>
  );
}
