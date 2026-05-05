'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import s from './dashboard.module.css';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: string;
  completed: boolean;
  locked: boolean;
}

interface UserInfo {
  username: string;
  balance: number;
  tier: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [animBalance, setAnimBalance] = useState(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/tasks');
    if (res.status === 401) { router.push('/auth/login'); return; }
    const data = await res.json();
    setUser(data.user);
    setTasks(data.tasks);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Animate balance counter
  useEffect(() => {
    if (!user) return;
    let start = animBalance;
    const end = user.balance;
    if (start === end) return;
    const step = Math.ceil(Math.abs(end - start) / 30);
    const timer = setInterval(() => {
      start = start < end ? Math.min(start + step, end) : Math.max(start - step, end);
      setAnimBalance(start);
      if (start === end) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [user?.balance]);

  const handleSubmit = async () => {
    if (!activeTask || !answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: activeTask.id, answer }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✅ Task completed! +KSh ${data.reward} earned`);
        setActiveTask(null);
        setAnswer('');
        setUser(u => u ? {...u, balance: data.newBalance} : u);
        fetchData();
      } else {
        showToast('❌ ' + data.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = () => {
    showToast('📱 M-Pesa withdrawal initiated! (Demo mode)');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const tierLabel = user?.tier || 'free';

  return (
    <div className={s.dash}>
      {/* Topbar */}
      <div className={s.dash__top}>
        <div className={s.dash__logo}>BusinessHub</div>
        <div className={s.dash__top_right}>
          <span className={s.dash__username}>👤 {user?.username}</span>
          <span className={`${s.dash__tier} ${s[`--${tierLabel}`]}`}>{tierLabel}</span>
          <button className={s.dash__logout} onClick={() => { document.cookie = 'auth_token=; Max-Age=0'; router.push('/'); }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className={s.dash__body}>
        {/* Balance Card */}
        <div className={s.dash__balance_card}>
          <div>
            <div className={s.dash__balance_label}>Available Balance</div>
            <div className={s.dash__balance_amount}>KSh {animBalance}</div>
          </div>
          <div className={s.dash__balance_actions}>
            <button className={s.dash__btn_outline} onClick={handleWithdraw}>📱 Withdraw via M-Pesa</button>
            <button className={s.dash__btn_primary} onClick={() => router.push('/upgrade')}>⬆ Upgrade Plan</button>
          </div>
        </div>

        {/* Stats */}
        <div className={s.dash__summary}>
          <div className={s.dash__stat_card}>
            <div className={s.dash__stat_label}>Balance</div>
            <div className={`${s.dash__stat_val} ${s['--green']}`}>KSh {user?.balance ?? 0}</div>
            <div className={s.dash__stat_sub}>Ready to withdraw</div>
          </div>
          <div className={s.dash__stat_card}>
            <div className={s.dash__stat_label}>Tasks Done</div>
            <div className={s.dash__stat_val}>{completedCount}</div>
            <div className={s.dash__stat_sub}>of {tasks.length} available</div>
          </div>
          <div className={s.dash__stat_card}>
            <div className={s.dash__stat_label}>Account Tier</div>
            <div className={`${s.dash__stat_val} ${s['--gold']}`} style={{fontSize:'1.2rem',textTransform:'capitalize'}}>{tierLabel}</div>
            <div className={s.dash__stat_sub}>{tierLabel === 'free' ? 'Upgrade to unlock more' : 'All tasks unlocked'}</div>
          </div>
          <div className={s.dash__stat_card}>
            <div className={s.dash__stat_label}>Total Earned</div>
            <div className={`${s.dash__stat_val} ${s['--green']}`}>KSh {user?.balance ?? 0}</div>
            <div className={s.dash__stat_sub}>Lifetime earnings</div>
          </div>
        </div>

        {/* Tasks */}
        <div className={s.dash__section_head}>
          <div className={s.dash__section_title}>Available Tasks</div>
          <div className={s.dash__section_meta}>{tasks.length} tasks | {completedCount} completed</div>
        </div>

        <div className={s.dash__tasks}>
          {tasks.map(task => (
            <div
              key={task.id}
              className={`${s.dash__task_card} ${task.locked ? s['--locked'] : ''} ${task.completed ? s['--done'] : ''}`}
            >
              <span className={s.dash__task_type}>{task.type}</span>
              <div className={s.dash__task_title}>{task.title}</div>
              <div className={s.dash__task_desc}>{task.description}</div>
              <div className={s.dash__task_footer}>
                <span className={s.dash__task_reward}>+KSh {task.reward}</span>
                {task.completed ? (
                  <button className={`${s.dash__task_btn} ${s['--done-btn']}`}>✓ Done</button>
                ) : task.locked ? (
                  <button className={`${s.dash__task_btn} ${s['--upgrade']}`} onClick={() => router.push('/upgrade')}>
                    🔒 Upgrade
                  </button>
                ) : (
                  <button className={`${s.dash__task_btn} ${s['--start']}`} onClick={() => setActiveTask(task)}>
                    Start →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {activeTask && (
        <div className={s.dash__modal_overlay} onClick={e => { if(e.target === e.currentTarget) setActiveTask(null); }}>
          <div className={s.dash__modal}>
            <div className={s.dash__modal_title}>{activeTask.title}</div>
            <div className={s.dash__modal_sub}>{activeTask.description}</div>
            <textarea
              placeholder="Type your answer here… Be specific and accurate."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />
            <div className={s.dash__modal_actions}>
              <button className={s.dash__modal_cancel} onClick={() => { setActiveTask(null); setAnswer(''); }}>
                Cancel
              </button>
              <button
                className={s.dash__modal_submit}
                onClick={handleSubmit}
                disabled={submitting || !answer.trim()}
              >
                {submitting ? 'Submitting…' : `Submit & Earn KSh ${activeTask.reward}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={s.dash__toast}>{toast}</div>}
    </div>
  );
}
