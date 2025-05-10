/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client';

import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';

import type { User } from '@/types/user';
import { auth } from '@/lib/firebase';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp({ firstName, lastName, email, password }: SignUpParams): Promise<{ error?: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fullName = `${firstName} ${lastName}`;

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      return {};
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred during sign up.' };
    }
  }

  async signInWithOAuth({ provider }: SignInWithOAuthParams): Promise<{ error?: string }> {
    try {
      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        case 'discord':
          return { error: 'Discord auth not supported directly. Use custom implementation.' };
      }

      await signInWithPopup(auth, authProvider);
      return {};
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred during OAuth sign in.' };
    }
  }

  async signInWithPassword({ email, password }: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {};
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred during password sign in.' };
    }
  }

  async resetPassword({ email }: ResetPasswordParams): Promise<{ error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {};
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred during password reset.' };
    }
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password update not implemented.' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const [firstName, ...rest] = (firebaseUser.displayName || '').split(' ');
          const user: User = {
            id: firebaseUser.uid,
            avatar: firebaseUser.photoURL || '/assets/avatar.png',
            firstName: firstName || '',
            lastName: rest.join(' ') || '',
            email: firebaseUser.email || '',
          };
          resolve({ data: user });
        } else {
          resolve({ data: null });
        }
      });
    });
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      await signOut(auth);
      return {};
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred during sign out.' };
    }
  }
}

export const authClient = new AuthClient();
