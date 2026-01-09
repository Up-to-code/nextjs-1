"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserStore } from "@/lib/stores/user-store";
import { useOrg } from "@/lib/stores/org-store";

export function usePermission(permissionKey: 'viewOrders' | 'manageOrders' | 'manageProducts' | 'manageSettings') {
    const { user } = useUserStore();
    const organization = useOrg();

    const membership = useQuery(api.organizations.getMyMembership,
        (user?.id && organization?.id) ? {
            workosOrgId: organization.id,
            workosUserId: user.id
        } : "skip"
    );

    const isLoading = membership === undefined;

    // E2E Mock Injection
    if (typeof window !== 'undefined' && (window as any).__E2E_MOCK_PERMISSION__) {
        return { hasPermission: true, isLoading: false, role: 'owner' };
    }

    if (isLoading) {
        return { hasPermission: false, isLoading: true, role: null };
    }

    if (!membership) {
        return { hasPermission: false, isLoading: false, role: null };
    }

    // Admin and Owner have all permissions implicitly
    if (membership.role === 'admin' || membership.role === 'owner') {
        return { hasPermission: true, isLoading: false, role: membership.role };
    }

    // Check specific permission for members
    const hasPermission = !!membership.permissions?.[permissionKey];

    return {
        hasPermission,
        isLoading: false,
        role: membership.role
    };
}
