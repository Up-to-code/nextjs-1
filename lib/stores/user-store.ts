import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User type matching WorkOS user structure
export interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profilePictureUrl: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

// Extended user profile for business details
export interface UserProfile extends User {
    businessName?: string;
    phone?: string;
    address?: string;
    role?: 'admin' | 'manager' | 'employee';
}

interface UserState {
    // State
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: UserProfile | null) => void;
    updateUser: (updates: Partial<UserProfile>) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: true,

            // Set user (login)
            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            }),

            // Update user profile partially
            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),

            // Set loading state
            setLoading: (loading) => set({ isLoading: loading }),

            // Logout - clear user state
            logout: () => set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            }),
        }),
        {
            name: 'user-storage', // localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

// Selectors for optimized re-renders
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsLoading = () => useUserStore((state) => state.isLoading);
