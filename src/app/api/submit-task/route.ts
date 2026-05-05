import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const userId = await getAuthUser();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { taskId, answer } = await req.json();
  if (!taskId || !answer) return NextResponse.json({ error: 'Task ID and answer required' }, { status: 400 });

  const user = store.users.get(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const task = store.tasks.find(t => t.id === taskId);
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  if (user.completedTasks.includes(taskId)) {
    return NextResponse.json({ error: 'Task already completed' }, { status: 400 });
  }

  if (user.tier === 'free' && user.completedTasks.length >= 1) {
    return NextResponse.json({ error: 'Upgrade to access more tasks' }, { status: 403 });
  }

  user.completedTasks.push(taskId);
  user.balance += task.reward;
  store.users.set(userId, user);

  return NextResponse.json({
    success: true,
    reward: task.reward,
    newBalance: user.balance,
  });
}
