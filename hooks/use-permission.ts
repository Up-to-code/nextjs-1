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

    // console.log(`🔍 usePermission Inputs: UserID=${user?.id}, OrgID=${organization?.id}, Key=${permissionKey}`);

    const isLoading = membership === undefined;

    if (isLoading) {
        // console.log(`⌛ usePermission Loading...`);
        return { hasPermission: false, isLoading: true, role: null };
    }

    if (!membership) {
        console.log(`❌ usePermission: No membership found for User ${user?.id} in Org ${organization?.id}`);
        return { hasPermission: false, isLoading: false, role: null };
    }

    // Admin and Owner have all permissions implicitly
    if (membership.role === 'admin' || membership.role === 'owner') {
        console.log(`🔐 usePermission(${permissionKey}): Granted (Role: ${membership.role})`);
        return { hasPermission: true, isLoading: false, role: membership.role };
    }

    // Check specific permission for members
    const hasPermission = !!membership.permissions?.[permissionKey];
    console.log(`🔐 usePermission(${permissionKey}): ${hasPermission ? 'Granted' : 'Denied'} (Role: ${membership.role}, Perms: ${JSON.stringify(membership.permissions)})`);

    return {
        hasPermission,
        isLoading: false,
        role: membership.role
    };
}
