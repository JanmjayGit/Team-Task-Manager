import { CalendarDays, UserRound } from 'lucide-react';

const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];

const statusStyles = {
  TODO: 'border-slate-600 bg-slate-700/70 text-slate-100',
  IN_PROGRESS: 'border-amber-500/40 bg-amber-500/15 text-amber-200',
  DONE: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200',
};

function TaskCard({ task, onStatusChange }) {
  const assignee = task.assignedTo?.name || task.assignedToName || task.assigneeName || task.assignedToEmail || task.assignedToId;
  const isOverdue = (() => {
    if (!task.dueDate || task.status === 'DONE') {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  })();

  return (
    <article
      className={`rounded-xl border bg-slate-800 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/40 ${
        isOverdue ? 'border-red-500 hover:border-red-400' : 'border-gray-700 hover:border-blue-400/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-6 text-white">{task.title}</h3>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[task.status] || statusStyles.TODO}`}>
            {task.status}
          </span>
          {isOverdue && (
            <span className="rounded-lg border border-red-500/50 bg-red-500/15 px-2.5 py-1 text-[11px] font-semibold text-red-200">
              Overdue
            </span>
          )}
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{task.description || 'No description provided.'}</p>

      <div className="mt-4 space-y-2 text-sm text-gray-300">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-gray-400">
            <CalendarDays size={15} />
            Due date
          </span>
          <span className="rounded-lg border border-gray-700 bg-slate-900 px-2 py-1 text-xs text-gray-200">
            {task.dueDate || 'Unscheduled'}
          </span>
        </div>

        {assignee && (
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-gray-400">
              <UserRound size={15} />
              Assigned
            </span>
            <span className="truncate text-right text-gray-200">{assignee}</span>
          </div>
        )}
      </div>

      <label className="mt-4 block">
        <span className="sr-only">Update task status</span>
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}

export default TaskCard;
