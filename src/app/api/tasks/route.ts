import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = store.users.get(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const tasks = store.tasks.map(t => ({
    ...t,
    completed: user.completedTasks.includes(t.id),
    locked: user.tier === 'free' && !user.completedTasks.includes(t.id) && user.completedTasks.length >= 1,
  }));

  return NextResponse.json({
    tasks,
    user: {
      username: user.username,
      balance: user.balance,
      tier: user.tier,
    }
  });
}
