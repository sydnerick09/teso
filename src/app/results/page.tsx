'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import s from './results.module.css';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<{ score: number; total: number; answers: number[] } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('assessment_score');
    if (!raw) { router.push('/assessment'); return; }
    setData(JSON.parse(raw));
  }, [router]);

  if (!data) return null;

  const pass = data.score / data.total >= 0.8; // 4/5 = 80%

  const handleContinue = async () => {
    setSaving(true);
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentPassed: pass }),
      });
      localStorage.removeItem('assessment_score');
      if (pass) router.push('/bonus');
      else router.push('/assessment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={s.results}>
      <div className={s.results__icon}>{pass ? '🎉' : '😔'}</div>
      <h1 className={`${s.results__title} ${pass ? s['--pass'] : s['--fail']}`}>
        {pass ? 'Congratulations! You passed!' : 'Almost there!'}
      </h1>
      <p className={s.results__sub}>
        {pass
          ? 'You qualify for AI training tasks on Business Hub.'
          : 'You need to score at least 4/5. Try again!'}
      </p>

      <div className={s.results__card}>
        <div className={`${s.results__score} ${pass ? s['--pass'] : s['--fail']}`}>
          {data.score}/{data.total}
        </div>
        <div className={s.results__score_label}>Your Score</div>

        <div className={s.results__breakdown}>
          {questions.map((q, i) => {
            const correct = data.answers[i] === q.correct;
            return (
              <div key={i} className={s.results__row}>
                <span className={s.results__row_label}>{q.type}</span>
                <span className={correct ? s.results__correct : s.results__wrong}>
                  {correct ? '✓ Correct' : '✗ Wrong'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        className={`${s.results__btn} ${!pass ? s['--retry'] : ''}`}
        onClick={handleContinue}
        disabled={saving}
      >
        {saving ? 'Saving…' : pass ? 'Continue →' : 'Retry Assessment →'}
      </button>
    </div>
  );
}
