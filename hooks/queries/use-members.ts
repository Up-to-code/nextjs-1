"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrg } from "@/lib/stores/org-store";

export function useMembers() {
    const organization = useOrg();

    const members = useQuery(api.organizations.getMembers,
        organization?.id ? { workosOrgId: organization.id } : "skip"
    );

    const updateRoleMutation = useMutation(api.organizations.updateMemberRole);

    const updateMemberRole = async (memberId: string, role: string, permissions: any) => {
        if (!organization?.id) return;
        // Note: The mutation expects `organizationId`, `userId` etc. 
        // But wait, the `updateMemberRole` mutation signature in `convex/organizations.ts` needs to be checked.
        // Assuming consistent signature or I'll check it in next step.
        // Actually, let's just expose the raw mutation or a wrapper if we know the args.
        // For now, I'll expose it and let the component call it with correct args found from the member object.
    };

    return {
        members: members || [],
        isLoading: members === undefined,
        updateRoleMutation // exposing the mutation directly for now
    };
}
