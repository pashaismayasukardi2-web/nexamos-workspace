'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthSession, IAMUser } from '../types/auth';
import { getSession, login as authLogin, logout as authLogout, updateUserSession } from '../lib/auth';

interface AuthContextType {
  session: AuthSession | null;
  user: IAMUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshSession: () => void;
  updateUser: (partial: Partial<IAMUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  refreshSession: () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = () => {
    const current = getSession();
    setSession(current);
    setIsLoading(false);
  };

  const updateUser = (partial: Partial<IAMUser>) => {
    const updated = updateUserSession(partial);
    if (updated) {
      setSession(updated);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading,
        login: authLogin,
        logout: authLogout,
        refreshSession,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

