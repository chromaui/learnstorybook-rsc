import { revalidatePath } from 'next/cache';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';

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

  if (error) {
    throw new Error(error);
  }

  return tasksVal;
};

async function getDescription(id: Task['id']) {
  const res = await fetch(`/api/lorem?id=${id}`);
  return (await res.json()).lorem;
}

export const useTask = (id?: Task['id']) => {
  const [task, setTask] = useState<Task | null>();
  useEffect(() => {
    seed().then((tasks) => setTask(tasks.find((t) => t.id === id)));
  }, [id]);

  const [description, setDescription] = useState<string | null>();
  useEffect(() => {
    id && getDescription(id).then((val) => setDescription(val));
  }, [id]);

  return {
    ...task,
    description,
  };
};

export const updateTaskState = () => {};
// export const updateTaskState = async ({
//   id,
//   newTaskState,
// }: {
//   id: Task['id'];
//   newTaskState: Task['state'];
// }) => {

//   console.log('updateTaskState', { id, newTaskState });

//   const taskIndex = tasks.findIndex((task) => task.id === id);
//   if (taskIndex >= 0) {
//     tasks[taskIndex].state = newTaskState;
//   }

//   revalidatePath('/');
// };
