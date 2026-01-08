'use client';

import { useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useOrgStore, Organization } from '@/lib/stores/org-store';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

/**
 * Hook to sync WorkOS organization with Zustand org store and Convex DB
 * Use this alongside useAuthSync in providers
 */
export function useOrgSync() {
    const { user } = useAuth();
    const { setOrganization, setLoading } = useOrgStore();
    // @ts-expect-error - convex codegen needed to generate organizations API type
    const syncOrg = useMutation(api.organizations.sync);

    useEffect(() => {
        setLoading(true);

        // WorkOS user may have organizationId if they selected one during sign-in
        if (user) {
            // Check if user has organization membership
            const orgId = (user as any).organizationId || null;
            const orgName = (user as any).organizationName || null;

            if (orgId && orgName) {
                setOrganization({
                    id: orgId,
                    name: orgName,
                });

                // Sync to Convex (create/update basic info)
                console.log('🔄 Syncing WorkOS Org to Convex:', { id: orgId, name: orgName });
                syncOrg({
                    workosOrgId: orgId,
                    name: orgName,
                }).then(() => console.log('✅ Convex Sync Complete'))
                    .catch(err => console.error("❌ Failed to sync org to Convex:", err));

            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [user, setOrganization, setLoading, syncOrg]);
}
