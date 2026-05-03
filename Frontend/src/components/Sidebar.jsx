import { BarChart3, CheckSquare, FolderKanban, LogOut, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
];

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="fixed inset-x-0 top-0 z-40 border-b border-gray-700 bg-slate-950/95 backdrop-blur lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-5 px-5 py-4 lg:px-6 lg:py-7">
        <div className="flex items-center justify-between gap-4 lg:block">
          <NavLink to="/dashboard" className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500 text-base font-semibold text-white shadow-lg shadow-blue-500/20">
                <Users size={20} strokeWidth={2.4} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-white">Team Task Manager</p>
                <p className="truncate text-sm text-gray-400">{user?.name || user?.email}</p>
              </div>
            </div>
          </NavLink>

          <span className="rounded-xl border border-gray-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-blue-200 lg:mt-5 lg:inline-block">
            {user?.role}
          </span>
        </div>

        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-2 lg:overflow-visible">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition lg:min-w-0 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-300 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-800">
                <item.icon size={16} strokeWidth={2.3} />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden flex-1 lg:block" />

        <button
          type="button"
          onClick={handleLogout}
          className="hidden items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-blue-400 hover:bg-slate-900 hover:text-white lg:flex"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
