"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, db, googleProvider } from '@/lib/firebase';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/types';

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutApp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          const newProfile: Omit<AppUser, 'id'> & { id?: string } = {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '익명 사용자',
            photoURL: firebaseUser.photoURL || undefined,
            spotifyId: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            followers: 0,
            following: 0,
            waveCount: 0,
            musicDNA: undefined,
          };

          await setDoc(userRef, {
            ...newProfile,
            id: firebaseUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            spotifyConnected: false,
          });
          setProfile({ id: firebaseUser.uid, ...newProfile } as AppUser);
        } else {
          const data = snap.data() as AppUser & { updatedAt?: Date };
          // best-effort touch updatedAt
          try {
            await updateDoc(userRef, { updatedAt: serverTimestamp() });
          } catch {}
          setProfile(data);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogleHandler = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutHandler = async () => {
    await signOut(auth);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    signInWithGoogle: signInWithGoogleHandler,
    signOutApp: signOutHandler,
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
