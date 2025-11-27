import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, handleApiError, setAuthToken, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext();

const STORAGE_TOKEN_KEY = 'taskTracker:token';
const STORAGE_USER_KEY = 'taskTracker:user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (storedToken) {
      setAuthToken(storedToken);
    }
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setAuthToken(null);
    setUser(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    setAuthLoading(true);
    try {
      const data = await api.login(credentials);
      setAuthToken(data.token);
      localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw new Error(handleApiError(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      login,
      logout,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

