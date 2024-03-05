import { revalidatePath } from 'next/cache';
import { faker } from '@faker-js/faker';
import { useCallback, useEffect, useState } from 'react';

let seeded = false;

export type Task = {
  id: string;
  title: string;
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED';
};
let _tasks: Task[] = [];

async function getTasks() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1');
  const data = await response.json();
  return data.map((task: { id: string; title: string; completed: boolean }) => ({
    id: `${task.id}`,
    title: task.title,
    state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
  }));
}

// TODO: what if data library looks something like this?
async function seed() {
  if (seeded) return _tasks;
  _tasks = await getTasks();
  seeded = true;

  return _tasks;
}

export const useTasks = () => {
  const [error, setError] = useState<string | void>();
  const [tasksVal, setTasks] = useState<Task[]>();

  useEffect(() => {
    (async () => {
      try {
        setError(undefined);
        setTasks(await getTasks());
      } catch (err: any) {
        setError(err.message);
      }
    })();
  }, []);

  const setTaskState = useCallback(
    (id: Task['id'], state: Task['state']) => {
      setTasks(tasksVal?.map((t) => (t.id === id ? { ...t, state } : t)));
    },
    [tasksVal, setTasks]
  );

  if (error) {
    throw new Error(error);
  }

  return [tasksVal, setTaskState] as const;
};

async function getDescription(id: Task['id']) {
  const res = await fetch(`/api/lorem?id=${id}`);
  return (await res.json()).lorem;
}

export const useTaskDescription = (id: Task['id'] | false) => {
  const [description, setDescription] = useState<string | null>();
  useEffect(() => {
    id && getDescription(id).then((val) => setDescription(val));
  }, [id]);

  return description;
};
