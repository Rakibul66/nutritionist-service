import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  firebaseAuth,
  googleAuthProvider,
  isFirebaseReady,
} from '../services/firebaseClient';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>; // Google sign-in
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  adminLogin: (phone: string, password: string) => Promise<boolean>;
  adminAuthenticated: boolean;
  adminIdentity: string | null;
  logout: () => Promise<void>;
  firebaseReady: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const ADMIN_SESSION_KEY = 'nutritionist-admin-session';
const ADMIN_PHONE = '01827664306';
const ADMIN_PASSWORD = '123456';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminIdentity, setAdminIdentity] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { phone?: string; isAuthenticated?: boolean };
      if (parsed.isAuthenticated && parsed.phone) {
        setAdminAuthenticated(true);
        setAdminIdentity(parsed.phone);
      }
    } catch {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, []);

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
      throw new Error('Firebase auth is not configured.');
    }
    await signInWithPopup(firebaseAuth, googleAuthProvider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!firebaseAuth) {
      throw new Error('Firebase auth is not configured.');
    }
    await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  };

  const signupWithEmail = async (email: string, password: string) => {
    if (!firebaseAuth) {
      throw new Error('Firebase auth is not configured.');
    }
    await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
  };

  const adminLogin = async (phone: string, password: string) => {
    const isValid = phone.trim() === ADMIN_PHONE && password.trim() === ADMIN_PASSWORD;
    if (!isValid) {
      return false;
    }

    const identity = phone.trim();
    setAdminAuthenticated(true);
    setAdminIdentity(identity);
    window.localStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({ phone: identity, isAuthenticated: true })
    );
    return true;
  };

  const logout = async () => {
    setAdminAuthenticated(false);
    setAdminIdentity(null);
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
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
      loginWithEmail,
      signupWithEmail,
      adminLogin,
      adminAuthenticated,
      adminIdentity,
      logout,
      firebaseReady: isFirebaseReady,
    }),
    [user, loading, adminAuthenticated, adminIdentity]
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
