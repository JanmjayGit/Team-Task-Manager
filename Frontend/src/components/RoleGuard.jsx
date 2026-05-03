import { useAuth } from '../context/useAuth';

function RoleGuard({ allow, children, fallback = null }) {
  const { user } = useAuth();
  const roles = Array.isArray(allow) ? allow : [allow];

  if (!roles.includes(user?.role)) {
    return fallback;
  }

  return children;
}

export default RoleGuard;
