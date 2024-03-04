import React from 'react';
import { Task, useTaskDescription } from '@/data/tasks';
import Link from 'next/link';

export default function TaskItem({
  task: { id, title, state },
  expanded,
  onArchiveTask,
  onPinTask,
}: {
  task: Task;
  expanded: boolean;
  onArchiveTask: () => void;
  onPinTask: () => void;
}) {
  const description = useTaskDescription(expanded && id);

  return (
    <>
      <div className={`list-item ${state} ${expanded ? 'expanded' : ''}`}>
        <label htmlFor="checked" aria-label={`archiveTask-${id}`} className="checkbox">
          <input
            type="checkbox"
            disabled={true}
            name="checked"
            id={`archiveTask-${id}`}
            checked={state === 'TASK_ARCHIVED'}
          />
          <span className="checkbox-custom" onClick={onArchiveTask} />
        </label>

        <Link href={`/tasks/${id}`} aria-label={title} className="title">
          <input
            type="text"
            value={title}
            readOnly={true}
            name="title"
            placeholder="Input title"
            style={{ textOverflow: 'ellipsis' }}
          />
        </Link>

        {state !== 'TASK_ARCHIVED' && (
          <button
            type="submit"
            className="pin-button"
            id={`pinTask-${id}`}
            aria-label={`pinTask-${id}`}
            key={`pinTask-${id}`}
            onClick={onPinTask}
          >
            <span className={`icon-star`} />
          </button>
        )}
        {expanded && description && <div className="task-description">{description}</div>}
      </div>
    </>
  );
}
