'use client';
import { initializeApp, getApps, FirebaseOptions, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from './config';

export function initializeFirebase(config: FirebaseOptions = firebaseConfig) {
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export * from './provider';
export * from './auth/use-user';
