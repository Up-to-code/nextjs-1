'use client';

import { useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useOrgStore } from '@/lib/stores/org-store';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getUserOrganizationWithRole } from '@/app/actions/organization';

/**
 * Hook to sync WorkOS organization with Zustand org store and Convex DB
 * Use this alongside useAuthSync in providers
 */
export function useOrgSync() {
    const { user, loading: authLoading } = useAuth();
    const { setOrganization, setLoading } = useOrgStore();
    const syncOrg = useMutation(api.organizations.sync);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setLoading(false);
            return;
        }

        const fetchOrg = async () => {
            try {
                setLoading(true);
                const result = await getUserOrganizationWithRole();

                if (result.success && result.organization) {
                    const org = result.organization;

                    setOrganization({
                        id: org.id,
                        name: org.name,
                        email: org.metadata?.email,
                        phone: org.metadata?.phone,
                        address: org.metadata?.address,
                        description: org.metadata?.description,
                    });

                    // Sync to Convex
                    console.log('🔄 Syncing WorkOS Org to Convex:', { id: org.id, name: org.name });
                    syncOrg({
                        workosOrgId: org.id,
                        name: org.name,
                    }).catch(err => console.error("❌ Failed to sync org to Convex:", err));

                } else {
                    console.log("No organization found for user");
                    // Don't clear if not found? Or clear?
                    // Maybe user hasn't selected one or created one.
                }
            } catch (error) {
                console.error("Failed to fetch user organization:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrg();

    }, [user, authLoading, setOrganization, setLoading, syncOrg]);
}
