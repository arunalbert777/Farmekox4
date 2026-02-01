'use client';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

export interface FirebaseProviderProps {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children?: ReactNode;
}

const FirebaseContext = createContext<Omit<FirebaseProviderProps, 'children'> | undefined>(
  undefined
);

export function FirebaseProvider({
  children,
  ...props
}: FirebaseProviderProps) {
  const value = useMemo(() => props, [props.app, props.auth, props.firestore]);
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.app;
}

export function useAuth() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}
