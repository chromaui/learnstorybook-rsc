import React from 'react';
import { Task, getTask } from '@/lib/tasks';
import Link from 'next/link';

export default async function TaskItem({
  task: { id, title, state },
  expanded,
  onArchiveTask,
  onPinTask,
}: {
  task: Task;
  expanded: boolean;
  onArchiveTask: () => Promise<void>;
  onPinTask: () => Promise<void>;
}) {
  const description = expanded ? (await getTask(id)).description : false;

  return (
    <>
      <Link href={`/tasks/${id}`} className={`list-item ${state} ${expanded ? 'expanded' : ''}`}>
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
        {description && <div className="task-description">{description}</div>}
      </Link>
    </>
  );
}
