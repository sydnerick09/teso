'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import s from './assessment.module.css';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function AssessmentPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  const handleNext = () => {
    const newAnswers = [...answers, selected!];
    if (current < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      // Done — store answers and navigate to results
      const score = newAnswers.filter((a, i) => a === questions[i].correct).length;
      localStorage.setItem('assessment_score', JSON.stringify({ score, total: questions.length, answers: newAnswers }));
      router.push('/results');
    }
  };

  if (!started) {
    return (
      <div className={s.quiz}>
        <div className={s.quiz__intro}>
          <div className={s.quiz__intro_icon}>🧠</div>
          <h1>AI Training Assessment</h1>
          <p>Complete this quick assessment to qualify for AI training tasks.</p>
          <p>⏱ Only <strong>2–5 minutes</strong> | 5 questions | Pass mark: 90%</p>
          <p style={{color:'#a78bfa', marginTop:'0.5rem'}}>You need to score 4 or 5 out of 5 to pass.</p>
          <button className={s.quiz__intro_btn} onClick={() => setStarted(true)}>
            Begin Assessment →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.quiz}>
      <div className={s.quiz__header}>
        <button className={s.quiz__back} onClick={() => { if(current > 0) { setCurrent(c => c-1); setSelected(answers[current-1] ?? null); } }}>
          ← Back
        </button>
        <div className={s.quiz__progress_bar_wrap}>
          <div className={s.quiz__progress_bar} style={{width: `${progress}%`}}></div>
        </div>
        <div className={s.quiz__progress_label}>
          <span>Question {current + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      <div className={s.quiz__card} key={current}>
        <div className={s.quiz__type_badge}>{q.type}</div>
        <div className={s.quiz__question}>{q.question}</div>
        <div className={s.quiz__options}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`${s.quiz__option} ${selected === i ? s['--selected'] : ''}`}
              onClick={() => setSelected(i)}
            >
              <span className={s.quiz__option_letter}>{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
        <button
          className={s.quiz__btn}
          disabled={selected === null}
          onClick={handleNext}
        >
          {current < questions.length - 1 ? `Next Question →` : 'Submit Assessment →'}
        </button>
      </div>
    </div>
  );
}
