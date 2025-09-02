"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  spotifyId?: string;
  createdAt: Date;
  updatedAt: Date;
  followers: number;
  following: number;
  waveCount: number;
  musicDNA?: {
    kpop: number;
    pop: number;
    rock: number;
    hiphop: number;
    electronic: number;
    jazz: number;
    classical: number;
    indie: number;
  };
}

interface AuthContextType {
  user: User | null;
  profile: any;
  loading: boolean;
  signOutApp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        if (!db) {
          console.error('Firebase database not initialized');
          setLoading(false);
          return;
        }
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: userData.displayName || firebaseUser.displayName || '',
            photoURL: userData.photoURL || firebaseUser.photoURL || undefined,
            spotifyId: userData.spotifyId,
            createdAt: userData.createdAt?.toDate() || new Date(),
            updatedAt: userData.updatedAt?.toDate() || new Date(),
            followers: userData.followers || 0,
            following: userData.following || 0,
            waveCount: userData.waveCount || 0,
            musicDNA: userData.musicDNA,
          });
          setProfile(userData);
        } else {
          // 새 사용자 생성
          const newUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            followers: 0,
            following: 0,
            waveCount: 0,
          };
          
          await setDoc(userRef, newUser);
          setUser(newUser);
          setProfile(newUser);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutApp = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }
    await signOut(auth);
  };

  const value = {
    user,
    profile,
    loading,
    signOutApp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
