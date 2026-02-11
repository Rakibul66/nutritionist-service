import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  firebaseAuth,
  googleAuthProvider,
  isFirebaseReady,
} from '../services/firebaseClient';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  firebaseReady: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return undefined;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (value) => {
      setUser(value);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    if (!firebaseAuth) {
      console.warn('Firebase auth is not configured.');
      return;
    }
    await signInWithPopup(firebaseAuth, googleAuthProvider);
  };

  const logout = async () => {
    if (!firebaseAuth) {
      return;
    }
    await signOut(firebaseAuth);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      firebaseReady: isFirebaseReady,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
