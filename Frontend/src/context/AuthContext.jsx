import { login as loginRequest, signup as signupRequest } from '../api/authApi';
import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './AuthContextValue';

const STORAGE_KEY = 'teamTaskUser';

const normalizeUser = (authResponse) => ({
  id: authResponse.id,
  name: authResponse.name,
  email: authResponse.email,
  role: authResponse.role,
  token: authResponse.token,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.token) {
          return parsedUser;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    return null;
  });

  const persistUser = useCallback((authResponse) => {
    const nextUser = normalizeUser(authResponse);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const login = useCallback(async (credentials) => {
    const authResponse = await loginRequest(credentials);
    return persistUser(authResponse);
  }, [persistUser]);

  const signup = useCallback(async (payload) => {
    const authResponse = await signupRequest(payload);
    return persistUser(authResponse);
  }, [persistUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === 'ADMIN',
      isMember: user?.role === 'MEMBER',
      isAuthenticated: Boolean(user?.token),
      login,
      signup,
      logout,
    }),
    [login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
