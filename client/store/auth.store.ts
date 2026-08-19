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
    user: User | null;

    accessToken: string | null;

    isAuthenticated: boolean;

    isLoading: boolean;

    setUser: (user: User | null) => void;

    setAccessToken: (token: string) => void;

    logout: () => void;
}

export const useAuthStore = create<AuthState>(
    (set) => ({
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
            set({
                accessToken: token,
            }),

        logout: () =>
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
            }),
    })
);