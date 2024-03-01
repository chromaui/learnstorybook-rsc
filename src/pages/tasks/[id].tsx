import React from 'react';
import TaskList from '@/components/TaskList';
import { useTasks } from '@/data/tasks';
import { useRouter } from 'next/router';

export default function TaskScreen() {
  const router = useRouter();
  const [id] = ([] as (string | undefined)[]).concat(router.query.id);
  try {
    const tasks = useTasks();
    return (
      <div className="page lists-show">
        <nav>
          <h1 className="title-page">Taskbox</h1>
        </nav>
        <TaskList tasks={tasks} expanded={id} />
      </div>
    );
  } catch (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <p className="title-message">Oh no!</p>
          <p className="subtitle-message">Something went wrong</p>
        </div>
      </div>
    );
  }
}
