import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { clearStoredAuth, getStoredAuth, saveAuth } from '../utils/storage';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredAuth);

  const login = useCallback((authData) => {
    const savedSession = saveAuth(authData);
    setSession(savedSession);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setSession(null);
  }, []);

  const value = useMemo(() => ({
    token: session?.token ?? null,
    role: session?.role ?? null,
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
  }), [session, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;