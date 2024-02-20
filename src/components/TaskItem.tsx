import React from 'react';
import { Task } from '../lib/tasks';

export default function TaskItem({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}: {
  task: Task;
  onArchiveTask: () => Promise<void>;
  onPinTask: () => Promise<void>;
}) {
  return (
    <div className={`list-item ${state}`}>
      <form action={onArchiveTask}>
        <label htmlFor="checked" aria-label={`archiveTask-${id}`} className="checkbox">
          <input
            type="checkbox"
            disabled={true}
            name="checked"
            id={`archiveTask-${id}`}
            checked={state === 'TASK_ARCHIVED'}
          />
          <button type="submit" className="checkbox-custom" />
        </label>
      </form>

      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
          style={{ textOverflow: 'ellipsis' }}
        />
      </label>

      {state !== 'TASK_ARCHIVED' && (
        <form action={onPinTask}>
          <button
            type="submit"
            className="pin-button"
            id={`pinTask-${id}`}
            aria-label={`pinTask-${id}`}
            key={`pinTask-${id}`}
          >
            <span className={`icon-star`} />
          </button>
        </form>
      )}
    </div>
  );
}
