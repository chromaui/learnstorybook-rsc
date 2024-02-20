import { revalidatePath } from 'next/cache';

let seeded = false;

export type Task = {
  id: string;
  title: string;
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED';
};
let tasks: Task[] = [];

async function seed() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1');
  const data = await response.json();
  tasks = data.map((task: { id: string; title: string; completed: boolean }) => ({
    id: `${task.id}`,
    title: task.title,
    state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
  }));
  seeded = true;
}

export const getTasks = async () => {
  if (!seeded) await seed();

  return tasks;
};

export const updateTaskState = async ({
  id,
  newTaskState,
}: {
  id: Task['id'];
  newTaskState: Task['state'];
}) => {
  'use server';

  console.log('updateTaskState', { id, newTaskState });

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex >= 0) {
    tasks[taskIndex].state = newTaskState;
  }

  revalidatePath('/');
};
