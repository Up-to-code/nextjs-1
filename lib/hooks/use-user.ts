'use client';

import { useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useUserStore, UserProfile } from '@/lib/stores/user-store';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

/**
 * Hook to sync WorkOS auth state with Zustand user store
 * Use this in your root layout or providers
 */
export function useAuthSync() {
    const { user, loading } = useAuth();
    const { setUser, setLoading } = useUserStore();
    const syncUser = useMutation(api.users.syncUser);

    useEffect(() => {
        setLoading(loading);

        if (!loading) {
            if (user) {
                // Map WorkOS user to our UserProfile
                const userProfile: UserProfile = {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePictureUrl: user.profilePictureUrl,
                    emailVerified: user.emailVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
                setUser(userProfile);

                // Sync to Convex
                syncUser({
                    workosUserId: user.id,
                    email: user.email,
                    name: [user.firstName, user.lastName].filter(Boolean).join(' '),
                    avatar: user.profilePictureUrl || undefined,
                }).catch((err: any) => console.error("Failed to sync user to Convex:", err));

            } else {
                setUser(null);
            }
        }
    }, [user, loading, setUser, setLoading, syncUser]);

    return { user, loading };
}

/**
 * Hook to get full user name
 */
export function useUserFullName() {
    const user = useUserStore((state) => state.user);
    if (!user) return null;

    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : user.email;
}

/**
 * Hook to get user initials for avatar
 */
export function useUserInitials() {
    const user = useUserStore((state) => state.user);
    if (!user) return '';

    if (user.firstName && user.lastName) {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
        return user.firstName.slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
}
