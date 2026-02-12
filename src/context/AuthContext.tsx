import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'host' | 'viewer';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const role = (userDoc.data()?.role || 'viewer') as UserRole;

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const setUserRole = async (role: UserRole) => {
    if (!auth.currentUser) return;

    // Save role to Firestore
    await setDoc(
      doc(db, 'users', auth.currentUser.uid),
      { role, email: auth.currentUser.email, createdAt: new Date() },
      { merge: true }
    );

    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, role };
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
