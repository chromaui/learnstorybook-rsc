import React from 'react';
import TaskItem from './TaskItem';
import { updateTaskState, Task } from '../data/tasks';

export default function TaskList({ tasks, expanded }: { tasks: Task[]; expanded?: Task['id'] }) {
  const tasksInOrder = [
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ];

  const filteredTasks = tasksInOrder.filter(
    (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
  );

  if (filteredTasks.length === 0) {
    return (
      <div className="list-items" key={'empty'} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-items" data-testid="success" key={'success'}>
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          expanded={expanded === task.id}
          task={task}
          onPinTask={updateTaskState.bind(null, { id: task.id, newTaskState: 'TASK_PINNED' })}
          onArchiveTask={updateTaskState.bind(null, { id: task.id, newTaskState: 'TASK_ARCHIVED' })}
        />
      ))}
    </div>
  );
}
