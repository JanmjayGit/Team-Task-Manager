import { FolderKanban, Plus, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getApiError } from '../api/axios';
import { addProjectMember, createProject, getProjects } from '../api/projectApi';
import { getProjectTasks } from '../api/taskApi';
import RoleGuard from '../components/RoleGuard';
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

function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [memberForms, setMemberForms] = useState({});
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProjects = async () => {
    setIsLoading(true);
    setError('');

    try {
      setProjects(asArray(await getProjects()));
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadProjects();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Project name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject(form);
      setForm({ name: '', description: '' });
      setSuccess('Project created successfully.');
      toast.success('Project created successfully');
      await loadProjects();
    } catch (requestError) {
      setError(getApiError(requestError));
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async (event, projectId) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    const userId = memberForms[projectId];

    if (!userId) {
      setError('Enter a user ID before adding a member.');
      return;
    }

    try {
      await addProjectMember(projectId, userId);
      setMemberForms((current) => ({ ...current, [projectId]: '' }));
      setSuccess('Member added to project.');
      toast.success('Member added to project');
    } catch (requestError) {
      setError(getApiError(requestError));
      toast.error('Something went wrong');
    }
  };

  const handleLoadTasks = async (projectId) => {
    setError('');

    try {
      setProjectTasks((current) => ({ ...current, [projectId]: { isLoading: true, items: [] } }));
      const tasks = asArray(await getProjectTasks(projectId));
      setProjectTasks((current) => ({ ...current, [projectId]: { isLoading: false, items: tasks } }));
    } catch (requestError) {
      setProjectTasks((current) => ({ ...current, [projectId]: { isLoading: false, items: [] } }));
      setError(getApiError(requestError));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-xl border border-gray-700 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20">
        <p className="text-sm font-medium text-blue-300">{isAdmin ? 'Admin project controls' : 'Member projects'}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Projects</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          {isAdmin ? 'Create projects, add members, and inspect project tasks.' : 'View projects where you are part of the team.'}
        </p>
      </section>

      {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">{success}</div>}

      <RoleGuard allow="ADMIN">
        <form onSubmit={handleCreateProject} className="rounded-xl border border-gray-700 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
          <h2 className="text-lg font-semibold text-white">Create project</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-200">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                placeholder="Website Redesign"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-200">Description</span>
              <input
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                placeholder="Redesign the public website"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Plus size={16} />
            {isSubmitting ? 'Creating...' : 'Create project'}
          </button>
        </form>
      </RoleGuard>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-xl border border-gray-700 bg-slate-900" />
          ))}
        {!isLoading && projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-700 bg-slate-900 p-8 text-center text-sm text-gray-400 md:col-span-2 xl:col-span-3">
            No projects found.
          </div>
        )}
        {!isLoading &&
          projects.map((project) => (
            <article
              key={project.id}
              className="rounded-xl border border-gray-700 bg-slate-900 p-6 shadow-sm transition duration-200 hover:scale-105 hover:border-blue-400/60 hover:shadow-lg hover:shadow-slate-950/40"
            >
              <div className="flex min-h-32 flex-col justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <FolderKanban size={18} className="text-blue-300" />
                    {project.name}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">{project.description || 'No description provided.'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLoadTasks(project.id)}
                  className="w-full rounded-xl border border-gray-700 px-3 py-2.5 text-sm font-medium text-gray-200 transition hover:border-blue-400 hover:bg-slate-800 hover:text-white"
                >
                  View tasks
                </button>
              </div>

              <RoleGuard allow="ADMIN">
                <form onSubmit={(event) => handleAddMember(event, project.id)} className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="number"
                    min="1"
                    value={memberForms[project.id] || ''}
                    onChange={(event) => setMemberForms((current) => ({ ...current, [project.id]: event.target.value }))}
                    className="w-full rounded-xl border border-gray-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="User ID"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-400"
                  >
                    <UserPlus size={16} />
                    Add member
                  </button>
                </form>
              </RoleGuard>

              {projectTasks[project.id] && (
                <div className="mt-5 rounded-xl border border-gray-700 bg-slate-950">
                  {projectTasks[project.id].isLoading && <p className="p-4 text-sm text-gray-400">Loading tasks...</p>}
                  {!projectTasks[project.id].isLoading && projectTasks[project.id].items.length === 0 && (
                    <p className="p-4 text-sm text-gray-400">No tasks for this project.</p>
                  )}
                  {!projectTasks[project.id].isLoading &&
                    projectTasks[project.id].items.map((task) => (
                      <div key={task.id} className="border-t border-gray-700 p-4 first:border-t-0">
                        <p className="font-medium text-white">{task.title}</p>
                        <p className="mt-1 text-sm text-gray-400">
                          {task.status} · Due {task.dueDate || 'Unscheduled'}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </article>
          ))}
      </section>
    </div>
  );
}

export default Projects;
