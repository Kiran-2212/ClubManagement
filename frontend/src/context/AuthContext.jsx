import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('collegeClubToken') || '');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('collegeClubUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('collegeClubToken', token);
    } else {
      localStorage.removeItem('collegeClubToken');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('collegeClubUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('collegeClubUser');
    }
  }, [user]);

  const login = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: !!token,
      isStudent: user?.role === 'STUDENT',
      isClubAdmin: user?.role === 'CLUB_ADMIN',
      isSystemAdmin: user?.role === 'SYSTEM_ADMIN',
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
