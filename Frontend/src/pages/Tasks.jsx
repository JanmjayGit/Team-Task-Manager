import { Calendar, CheckCircle2, Circle, Clock3, Filter, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { getApiError } from '../api/axios';
import { getProjects } from '../api/projectApi';
import { createTask, getMyTasks, getProjectTasks, updateTaskStatus } from '../api/taskApi';
import RoleGuard from '../components/RoleGuard';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/useAuth';

const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];

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

const getTaskProjectId = (task) => String(task.projectId || task.project?.id || task.project?.projectId || '');

function Tasks() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    dueDate: '',
    assignedToId: '',
    projectId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dateRef = useRef(null);

  const loadProjects = async () => {
    const projectList = asArray(await getProjects());
    setProjects(projectList);

    if (!form.projectId && projectList[0]?.id) {
      setForm((current) => ({ ...current, projectId: String(projectList[0].id) }));
    }

    return projectList;
  };

  const loadTasks = async (projectList = projects) => {
    setIsLoading(true);
    setError('');

    try {
      if (isAdmin) {
        const taskGroups = await Promise.all(
          projectList.map(async (project) => {
            const projectTasks = asArray(await getProjectTasks(project.id));
            return projectTasks.map((task) => ({
              ...task,
              projectId: task.projectId || task.project?.id || project.id,
              projectName: task.projectName || task.project?.name || project.name,
            }));
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const initialize = async () => {
        setIsLoading(true);
        setError('');

        try {
          const projectList = await loadProjects();
          await loadTasks(projectList);
        } catch (requestError) {
          setError(getApiError(requestError));
          toast.error('Something went wrong');
          setIsLoading(false);
        }
      };

      initialize();
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.dueDate || !form.assignedToId || !form.projectId) {
      setError('Title, due date, assigned user ID, and project are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask({
        ...form,
        assignedToId: Number(form.assignedToId),
        projectId: Number(form.projectId),
      });
      setSuccess('Task created successfully.');
      toast.success('Task created successfully');
      setForm((current) => ({
        ...current,
        title: '',
        description: '',
        status: 'TODO',
        dueDate: '',
        assignedToId: '',
      }));
      setSelectedProjectId(form.projectId);
      await loadTasks(projects);
    } catch (requestError) {
      setError(getApiError(requestError));
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setError('');
    setSuccess('');

    try {
      await updateTaskStatus(taskId, status);
      setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));
      setSuccess('Task status updated.');
      toast.success('Task updated successfully');
    } catch (requestError) {
      setError(getApiError(requestError));
      toast.error('Something went wrong');
    }
  };

  const handleProjectFilter = (event) => {
    setSelectedProjectId(event.target.value);
  };

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = !normalizedQuery || task.title?.toLowerCase().includes(normalizedQuery);
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesProject = !selectedProjectId || getTaskProjectId(task) === String(selectedProjectId);
      const matchesDueDate = !dueDateFilter || task.dueDate === dueDateFilter;

      return matchesSearch && matchesStatus && matchesProject && matchesDueDate;
    });
  }, [dueDateFilter, searchQuery, selectedProjectId, statusFilter, tasks]);

  const groupedTasks = useMemo(
    () => ({
      TODO: filteredTasks.filter((task) => task.status === 'TODO'),
      IN_PROGRESS: filteredTasks.filter((task) => task.status === 'IN_PROGRESS'),
      DONE: filteredTasks.filter((task) => task.status === 'DONE'),
    }),
    [filteredTasks],
  );

  const columnMeta = {
    TODO: { title: 'TODO', accent: 'bg-slate-400', icon: Circle },
    IN_PROGRESS: { title: 'IN_PROGRESS', accent: 'bg-amber-400', icon: Clock3 },
    DONE: { title: 'DONE', accent: 'bg-emerald-400', icon: CheckCircle2 },
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <section className="rounded-xl border border-gray-700 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">{isAdmin ? 'Assign and review work' : 'My assigned work'}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Tasks</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              {isAdmin ? 'Create tasks, assign owners, and review tasks by project.' : 'View your tasks and update progress.'}
            </p>
          </div>

          <div className="rounded-xl border border-gray-700 bg-slate-950 px-4 py-3 text-sm text-gray-300">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">{success}</div>}

      <RoleGuard allow="ADMIN">
        <form onSubmit={handleCreateTask} className="rounded-xl border border-gray-700 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
          <h2 className="text-lg font-semibold text-white">Assign task</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-200">Title</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                placeholder="Create dashboard UI"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-200">Assigned user ID</span>
              <input
                type="number"
                min="1"
                value={form.assignedToId}
                onChange={(event) => setForm((current) => ({ ...current, assignedToId: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                placeholder="2"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-200">Project</span>
              <select
                value={form.projectId}
                onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-200">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-200">Due date</span>

              <div className="relative mt-2">
                <input
                  ref={dateRef}
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      dueDate: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-700 bg-slate-950 px-3 pr-10 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  required
                />
                <Calendar
                  onClick={() =>
                    dateRef.current?.showPicker?.() || dateRef.current?.focus()
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
                />
              </div>
            </label>

            <label className="block md:col-span-2 xl:col-span-3">
              <span className="text-sm font-medium text-gray-200">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="mt-2 min-h-24 w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                placeholder="Build dark themed dashboard cards"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Plus size={16} />
            {isSubmitting ? 'Creating...' : 'Assign task'}
          </button>
        </form>
      </RoleGuard>

      <section className="rounded-xl border border-gray-700 bg-slate-900 p-4 shadow-lg shadow-slate-950/20 sm:p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{isAdmin ? 'Project tasks' : 'Assigned tasks'}</h2>
            <p className="mt-1 text-sm text-gray-400">Kanban board grouped by status.</p>
          </div>
          <span className="rounded-xl border border-gray-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-gray-400">
            {filteredTasks.length} visible
          </span>
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(220px,1fr)_180px_220px_180px]">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-200">
              <Search size={16} />
              Search tasks
            </span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              placeholder="Search by title"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-200">
              <Filter size={16} />
              Status
            </span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-200">
              <Filter size={16} />
              Project
            </span>
            <select
              value={selectedProjectId}
              onChange={handleProjectFilter}
              className="w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-200">
              <Calendar size={16} />
              Due date
            </span>
            <input
              type="date"
              value={dueDateFilter}
              onChange={(event) => setDueDateFilter(event.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </label>
        </div>

        {(searchQuery || statusFilter || selectedProjectId || dueDateFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              setSelectedProjectId('');
              setDueDateFilter('');
            }}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-gray-700 px-3 py-2 text-sm font-medium text-gray-200 transition hover:border-blue-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={16} />
            Clear filters
          </button>
        )}

        <div className="grid gap-5 xl:grid-cols-3">
          {statuses.map((status) => (
            <section key={status} className="min-h-96 rounded-xl border border-gray-700 bg-slate-950/80 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${columnMeta[status].accent}`} />
                  {(() => {
                    const Icon = columnMeta[status].icon;
                    return <Icon size={16} className="text-gray-300" />;
                  })()}
                  <h3 className="text-sm font-semibold tracking-wide text-white">{columnMeta[status].title}</h3>
                </div>
                <span className="rounded-lg border border-gray-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-gray-300">
                  {groupedTasks[status].length}
                </span>
              </div>

              <div className="space-y-3">
                {isLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-40 animate-pulse rounded-xl border border-gray-700 bg-slate-800" />
                  ))}

                {!isLoading && groupedTasks[status].length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-700 bg-slate-900/70 p-6 text-center text-sm text-gray-400">
                    No tasks yet
                  </div>
                )}

                {!isLoading &&
                  groupedTasks[status].map((task) => <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />)}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Tasks;
