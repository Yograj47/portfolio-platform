import { create } from "zustand";

export interface User {
  id: string;

  // Basic profile
  name: string;
  email: string;
  avatar?: string | null;

  role?: string | null;
  location?: string | null;

  // Availability
  isAvailable: boolean;
  openToFullTime: boolean;
  openToOpenSource: boolean;
  openToFreelance: boolean;

  // Public links
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  resumeUrl?: string | null;
}

interface AuthState {
  isSigningOut: boolean;
  setSigningOut: (pending: boolean) => void;
  sessionVersion: number;
  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  setUser: (user: User | null) => void;

  setAccessToken: (token: string) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSigningOut: false,
  setSigningOut: (pending) =>
    set((state) => ({
      isSigningOut: pending,
      sessionVersion:
        state.sessionVersion + (pending && !state.isSigningOut ? 1 : 0),
    })),
  sessionVersion: 0,
  user: null,

  accessToken: null,

  isAuthenticated: false,

  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setAccessToken: (token) =>
    set((state) => ({
      accessToken: token,
      isSigningOut: false,
      sessionVersion: state.sessionVersion + 1,
    })),

  logout: () =>
    set((state) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      sessionVersion: state.sessionVersion + 1,
    })),
}));
