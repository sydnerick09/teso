// In-memory store - for production replace with a real DB (PlanetScale, Supabase, etc.)
// This persists within a single serverless function lifecycle

export interface User {
  id: string;
  username: string;
  phone: string;
  passwordHash: string;
  balance: number;
  tier: 'free' | 'beginner' | 'skilled' | 'expert' | 'elite';
  assessmentPassed: boolean;
  bonusClaimed: boolean;
  completedTasks: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: string;
}

// Global store (persists in memory per serverless instance)
const globalStore = global as typeof globalThis & {
  users?: Map<string, User>;
  tasksList?: Task[];
};

if (!globalStore.users) globalStore.users = new Map();
if (!globalStore.tasksList) globalStore.tasksList = generateTasks();

export const store = {
  get users() { return globalStore.users!; },
  get tasks() { return globalStore.tasksList!; },
};

function generateTasks(): Task[] {
  const taskTypes = [
    { type: 'Text Annotation', base: 'Annotate the following text excerpt for sentiment, entities, and intent.' },
    { type: 'Classification', base: 'Classify the following item into the correct category.' },
    { type: 'Data Labeling', base: 'Label the data points in this dataset according to the guidelines.' },
    { type: 'Quality Review', base: 'Review this AI-generated content and flag any issues.' },
    { type: 'Translation Check', base: 'Verify this machine translation for accuracy and fluency.' },
  ];
  const rewards = [5, 8, 10, 12, 15, 20, 25];
  const tasks: Task[] = [];

  for (let i = 1; i <= 50; i++) {
    const t = taskTypes[(i - 1) % taskTypes.length];
    tasks.push({
      id: `task-${i}`,
      title: `${t.type} Task #${i}`,
      description: `${t.base} This task contributes to improving AI model performance. Expected time: 2-5 minutes.`,
      reward: rewards[i % rewards.length],
      type: t.type,
    });
  }
  return tasks;
}
