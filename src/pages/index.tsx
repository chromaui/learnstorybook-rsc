import React from 'react';
import TaskList from '@/components/TaskList';
import { useTasks } from '@/data/tasks';

export default function InboxScreen() {
  try {
    const [tasks, setTaskState] = useTasks();
    return (
      <div className="page lists-show">
        <nav>
          <h1 className="title-page">Taskbox</h1>
        </nav>
        <TaskList tasks={tasks} setTaskState={setTaskState} />
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
