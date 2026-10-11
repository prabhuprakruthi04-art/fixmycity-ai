import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  notificationsOptIn: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, pass: string, name?: string) => Promise<void>;
  logIn: (email: string, pass: string) => Promise<void>;
  logInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  toggleNotificationOptIn: (optIn: boolean) => Promise<void>;
  sendPushNotification: (title: string, body: string, reportId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user profile from Firestore
  const fetchProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: data.displayName || firebaseUser.displayName,
          notificationsOptIn: data.notificationsOptIn ?? true,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      } else {
        const newProf: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Citizen Auditor',
          notificationsOptIn: true,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProf);
        setProfile(newProf);
      }
    } catch (err) {
      console.error('Error fetching user profile from Firestore:', err);
      // Fallback
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Citizen Auditor',
        notificationsOptIn: true,
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string, name = 'Citizen Auditor') => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    const newProf: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: name,
      notificationsOptIn: true,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProf);
    } catch (e) {
      console.warn('Could not write user profile to firestore', e);
    }
    setProfile(newProf);
  };

  const logIn = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await fetchProfile(cred.user);
  };

  const logInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await fetchProfile(cred.user);
  };

  const logOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const toggleNotificationOptIn = async (optIn: boolean) => {
    if (!user) return;
    setProfile((prev) => (prev ? { ...prev, notificationsOptIn: optIn } : null));
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        notificationsOptIn: optIn,
      });
    } catch (e) {
      console.error('Failed to update notification preferences in firestore', e);
    }
  };

  // Push notification dispatcher
  const sendPushNotification = async (title: string, body: string, reportId?: string) => {
    // Only send for authenticated users who have opted in
    if (!user || !profile || !profile.notificationsOptIn) {
      return;
    }

    // 1. Browser Native Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
          });
        } catch (e) {
          console.warn('Native notification failed:', e);
        }
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(title, { body });
        }
      }
    }

    // 2. Persist in user's Firestore notifications subcollection
    try {
      const notifId = `notif-${Date.now()}`;
      await setDoc(doc(db, 'users', user.uid, 'notifications', notifId), {
        id: notifId,
        userId: user.uid,
        reportId: reportId || '',
        title,
        message: body,
        read: false,
        createdAt: new Date().toISOString(),
        type: title.toLowerCase().includes('resolved')
          ? 'resolution'
          : title.toLowerCase().includes('escalat')
          ? 'escalation'
          : 'status_change',
      });
    } catch (e) {
      console.warn('Could not save notification to Firestore:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        logIn,
        logInWithGoogle,
        logOut,
        toggleNotificationOptIn,
        sendPushNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
