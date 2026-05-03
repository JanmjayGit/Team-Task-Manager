import { AlertTriangle, CheckCircle2, Clock3, ListTodo } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getApiError } from '../api/axios';
import { getProjects } from '../api/projectApi';
import { getMyTasks, getProjectTasks } from '../api/taskApi';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/useAuth';

const asArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
};

const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'DONE') {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};

function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');

      try {
        const projectsResponse = await getProjects();
        const projectList = asArray(projectsResponse);
        setProjects(projectList);

        if (isAdmin && projectList.length > 0) {
          const taskGroups = await Promise.all(
            projectList.map(async (project) => {
              try {
                return asArray(await getProjectTasks(project.id));
              } catch {
                return [];
              }
            }),
          );
          setTasks(taskGroups.flat());
        } else {
          setTasks(asArray(await getMyTasks()));
        }
      } catch (requestError) {
        setError(getApiError(requestError));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [isAdmin]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((task) => task.status === 'DONE').length,
      pending: tasks.filter((task) => task.status !== 'DONE').length,
      overdue: tasks.filter(isOverdue).length,
    }),
    [tasks],
  );

  const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  const upcomingTasks = tasks
    .slice()
    .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-xl border border-gray-700 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20">
        <div>
          <p className="text-sm font-medium text-blue-300">{user?.name ? `${user.name}'s dashboard` : 'Your dashboard'}</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Track task volume, completion, deadlines, and project activity from one place.
          </p>
        </div>
        <div className="mt-5 inline-flex rounded-xl border border-gray-700 bg-slate-950 px-4 py-3 text-sm text-gray-300">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} visible
        </div>
        <div className="mt-5 max-w-md">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Completion progress</span>
            <span className="font-semibold text-white">{isLoading ? '...' : `${completionRate}%`}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-950">
            <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${isLoading ? 0 : completionRate}%` }} />
          </div>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={isLoading ? '...' : stats.total} tone="blue" icon={ListTodo} />
        <StatCard label="Completed tasks" value={isLoading ? '...' : stats.completed} tone="green" icon={CheckCircle2} />
        <StatCard label="Pending tasks" value={isLoading ? '...' : stats.pending} tone="amber" icon={Clock3} />
        <StatCard label="Overdue tasks" value={isLoading ? '...' : stats.overdue} tone="red" icon={AlertTriangle} />
      </section>

      <section className="rounded-xl border border-gray-700 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Nearest deadlines</h2>
          <span className="rounded-xl border border-gray-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-gray-400">
            Next {upcomingTasks.length}
          </span>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl border border-gray-700 bg-slate-800" />
            ))}
          {!isLoading && upcomingTasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-700 bg-slate-950 p-8 text-center text-sm text-gray-400 lg:col-span-2">
              No tasks to show yet.
            </div>
          )}
          {!isLoading &&
            upcomingTasks.map((task) => (
              <article
                key={task.id}
                className={`rounded-xl border bg-slate-800 p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/40 ${
                  isOverdue(task) ? 'border-red-500 hover:border-red-400' : 'border-gray-700 hover:border-blue-400/60'
                }`}
              >
                <div>
                  <p className="text-lg font-semibold text-white">{task.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{task.description || 'No description provided.'}</p>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-lg border border-gray-700 bg-slate-950 px-2.5 py-1 text-gray-200">{task.status}</span>
                  <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-blue-200">Due {task.dueDate || 'Unscheduled'}</span>
                  {isOverdue(task) && <span className="rounded-lg bg-red-500/15 px-2.5 py-1 text-red-200">Overdue</span>}
                </div>
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
