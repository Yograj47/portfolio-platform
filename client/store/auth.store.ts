import { create } from "zustand";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;

    setUser: (user: User | null) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
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
        })

}))